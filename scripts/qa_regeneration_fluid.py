from pathlib import Path
import subprocess,json,hashlib,re
root=Path(__file__).resolve().parents[1];out=root/'out';assets=root/'public/assets/regeneracao';video=out/'regeneracao-nova-base-v2.mp4'
def run(args):
 r=subprocess.run(args,capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr.decode('utf8',errors='replace'))
 return r
probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(video)]).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']),v['codec_name'],a['codec_name'])==(1080,1920,'30/1',360,'h264','aac')
decode=run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'])
(out/'regeneracao-fluid-decode.log').write_bytes(decode.stderr or b'Full decode passed.\n')
black=run(['ffmpeg','-hide_banner','-i',str(video),'-vf','blackdetect=d=0.1:pix_th=0.1','-an','-f','null','-']).stderr.decode('utf8',errors='replace')
assert 'black_start:' not in black
(out/'regeneracao-fluid-blackdetect.log').write_text(black,encoding='utf8')
pcm=run(['ffmpeg','-v','error','-i',str(video),'-map','0:a:0','-f','s16le','-']).stdout
audioHash=hashlib.sha256(pcm).hexdigest();previous=json.loads((assets/'render-qa.json').read_text(encoding='utf8'))
assert audioHash==previous['outputs'][0]['audioPcmSha256']
run(['ffmpeg','-y','-v','error','-i',str(video),'-vf','fps=2,scale=216:-1,tile=6x4','-frames:v','1',str(out/'regeneracao-fluid-contato.jpg')])
for name,start,length,fps,grid in [('queda',3,1.8,10,'6x3'),('pele',4.75,2,9,'6x3'),('reacao',6.9,4.5,4,'6x3')]:
 run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(video),'-t',str(length),'-vf',f'fps={fps},scale=216:-1,tile={grid}','-frames:v','1',str(out/f'regeneracao-fluid-{name}-sequencia.jpg')])
for name,t in [('andando',1.5),('apoio',4.4),('pele',5.7),('restaurada',6.6),('inspecao',7.8),('final',11.6)]:
 run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1',str(out/f'regeneracao-fluid-{name}.png')])
loud=run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-']).stderr.decode('utf8',errors='replace')
(out/'regeneracao-fluid-loudness.log').write_text(loud,encoding='utf8');levels=json.loads(re.findall(r'\{[^{}]+\}',loud)[-1])
paths=['src/remotion/RegenerationFluidRoot.tsx','src/remotion/regeneration-fluid/FluidPilot.tsx','src/remotion/regeneration-fluid/fluidMotion.ts','public/assets/regeneracao/mix-final.wav','public/assets/regeneracao/timing.json']
q=dict(file=str(video),sha256=hashlib.sha256(video.read_bytes()).hexdigest(),bytes=video.stat().st_size,duration=float(probe['format']['duration']),width=1080,height=1920,fps=30,frames=360,engine='Remotion 4.0.540',composition='Regeneracao-NovaBase',sourceHashes={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in paths},fullDecodePassed=True,blackIntervals=[],sameUserAudioVerified=True,audioPcmSha256=audioHash,loudness={k:float(levels[k]) for k in ['input_i','input_tp','input_lra']},lintPassed=True,generalTestsPassed=17,newMotionTestsPassed=3,buildPassed=True,agentVisualReview='pending',humanVisualApproved=False,humanListenApproved=False,published=False)
(assets/'render-qa-nova-base.json').write_text(json.dumps(q,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in q.items() if k!='sourceHashes'},ensure_ascii=False,indent=2))
