// An original, synthesized swung quartet. No recordings or external audio requests.
export class JazzRoom {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private callbacks = new Set<ReturnType<typeof setTimeout>>();
  private voices = new Set<AudioScheduledSourceNode>();
  private next = 0;
  private step = 0;
  private dead = false;
  private active = false;
  private volume = 0.24;
  private noise: AudioBuffer | null = null;
  private chords = [[50,57,60,64],[43,53,59,62],[48,55,59,64],[45,55,60,64]];
  constructor(private bpm: number, private seed: number, private onBeat: (n: number)=>void) {}
  private setup() {
    if(this.dead) throw new Error('Room closed');
    if(this.ctx) return;
    const Context = window.AudioContext || (window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
    if(!Context) throw new Error('Audio unavailable');
    this.ctx = new Context();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    const limiter=this.ctx.createDynamicsCompressor();
    limiter.threshold.value=-18; limiter.knee.value=18; limiter.ratio.value=6;
    this.master.connect(limiter); limiter.connect(this.ctx.destination);
    this.noise=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*.15),this.ctx.sampleRate);
    const data=this.noise.getChannelData(0);let state=this.seed;
    for(let i=0;i<data.length;i++){state=(Math.imul(state,1664525)+1013904223)>>>0;data[i]=(state/4294967296)*2-1;}
  }
  async start() {
    this.setup();
    const ctx=this.ctx!;
    await ctx.resume();
    if(this.dead || ctx.state==='closed') return false;
    if(this.active) return true;
    this.active=true; this.next=ctx.currentTime+.07; this.step=0;
    this.timer=setInterval(()=>this.schedule(),25);
    this.schedule();return true;
  }
  private keep(source: AudioScheduledSourceNode, output: AudioNode) {
    this.voices.add(source);
    source.onended=()=>{this.voices.delete(source);source.disconnect();output.disconnect();};
  }
  private note(midi:number,time:number,length:number,gain:number,type:OscillatorType='triangle') {
    if(!this.ctx||!this.master)return;
    const oscillator=this.ctx.createOscillator(), envelope=this.ctx.createGain();
    oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);
    envelope.gain.setValueAtTime(.0001,time);
    envelope.gain.exponentialRampToValueAtTime(gain,time+.012);
    envelope.gain.exponentialRampToValueAtTime(.0001,time+length);
    oscillator.connect(envelope);envelope.connect(this.master);
    this.keep(oscillator,envelope);oscillator.start(time);oscillator.stop(time+length+.02);
  }
  private brush(time:number,accent:boolean) {
    if(!this.ctx||!this.master||!this.noise)return;
    const source=this.ctx.createBufferSource(), filter=this.ctx.createBiquadFilter(), env=this.ctx.createGain();
    source.buffer=this.noise;filter.type='highpass';filter.frequency.value=accent?1600:5200;
    env.gain.setValueAtTime(accent?.16:.055,time);env.gain.exponentialRampToValueAtTime(.0001,time+.09);
    source.connect(filter);filter.connect(env);env.connect(this.master);
    this.voices.add(source);source.onended=()=>{this.voices.delete(source);source.disconnect();filter.disconnect();env.disconnect();};
    source.start(time);source.stop(time+.13);
  }
  private schedule() {
    if(!this.ctx||!this.active)return;
    const beat=60/this.bpm;
    while(this.next<this.ctx.currentTime+.12){
      const n=this.step, eighth=n%8, chord=this.chords[Math.floor(n/8)%4], t=this.next;
      if(eighth%2===0){const walk=[chord[0],chord[1]-12,chord[0]+12,chord[2]-12];this.note(walk[eighth/2],t,.32,.38,'sine');}
      if([0,3,6].includes(eighth))chord.slice(1).forEach((m,i)=>this.note(m+12,t+i*.008,.6,eighth===0?.085:.05));
      this.brush(t,eighth===2||eighth===6);
      if(eighth===7 && n%16===15)this.note(chord[3]+12,t,.25,.04,'sine');
      const callback=setTimeout(()=>{this.callbacks.delete(callback);if(this.active)this.onBeat(n%16);},Math.max(0,(t-this.ctx.currentTime)*1000));this.callbacks.add(callback);
      this.next+=beat*(eighth%2===0?2/3:1/3);this.step++;
    }
  }
  solo(pad:number) {
    if(!this.ctx||!this.active)return;
    const chord=this.chords[Math.floor(Math.max(0,this.step-1)/8)%4];
    const midi=[chord[1]+12,chord[2]+12,chord[3]+12,chord[0]+24][pad];
    this.note(midi,this.ctx.currentTime+.005,.7,.28);
    this.note(midi+12,this.ctx.currentTime+.006,.24,.035,'sine');
  }
  setVolume(value:number){this.volume=Math.max(0,Math.min(.5,value));this.master?.gain.setTargetAtTime(this.volume,this.ctx!.currentTime,.04);}
  stop() {
    this.active=false;
    if(this.timer)clearInterval(this.timer);this.timer=null;
    this.callbacks.forEach(clearTimeout);this.callbacks.clear();
    for(const source of this.voices){try{source.stop();}catch{/* already ended */}}
    this.voices.clear();
    if(this.ctx?.state==='running')void this.ctx.suspend().catch(()=>{});
  }
  dispose(){this.dead=true;this.stop();if(this.ctx&&this.ctx.state!=='closed')void this.ctx.close().catch(()=>{});}
}
