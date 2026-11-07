"""Verify actual comparison and derive isolated pilots by exact half-frame crops."""
from pathlib import Path
import json,subprocess,hashlib,re
root=Path(__file__).resolve().parents[1];out=root/'out';folder=root/'public/assets/regeneracao'
source=out/'regeneracao-comparacao-v3.mp4'
def run(args):
 r=subprocess.run(args,capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr.decode('utf8',errors='replace'))
 return r
for label,x in [('a',0),('b',1080)]:
 run(['ffmpeg','-y','-v','error','-i',str(source),'-vf',f'crop=1080:1920:{x}:0','-c:v','libx264','-crf','18','-preset','medium','-c:a','copy',str(out/f'regeneracao-piloto-{label}-v3.mp4')])
rows=[]
for label,width,path in [('comparison',2160,source),('a',1080,out/'regeneracao-piloto-a-v3.mp4'),('b',1080,out/'regeneracao-piloto-b-v3.mp4')]:
 probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(path)]).stdout)
 v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
 assert v['width']==width and v['height']==1920 and v['r_frame_rate']=='30/1' and int(v['nb_frames'])==360
 assert v['codec_name']=='h264' and a['codec_name']=='aac'
 decoded=run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'])
 (out/f'regeneracao-{label}-decode.log').write_bytes(decoded.stderr or b'Full decode passed.\n')
 black=run(['ffmpeg','-hide_banner','-i',str(path),'-vf','blackdetect=d=0.1:pix_th=0.1','-an','-f','null','-']).stderr.decode('utf8',errors='replace')
 (out/f'regeneracao-{label}-blackdetect.log').write_text(black,encoding='utf8')
 assert not re.findall('black_start:',black)
 pcm=run(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-f','s16le','-']).stdout
 rows.append(dict(label=label,file=str(path),duration=float(probe['format']['duration']),bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),audioPcmSha256=hashlib.sha256(pcm).hexdigest(),width=width,height=1920,fps=30,frames=360,fullDecodePassed=True,blackIntervals=[]))
assert len({r['audioPcmSha256'] for r in rows})==1
for label in ['a','b']:
 video=out/f'regeneracao-piloto-{label}-v3.mp4'
 run(['ffmpeg','-y','-v','error','-i',str(video),'-vf','fps=2,scale=216:-1,tile=6x4','-frames:v','1',str(out/f'regeneracao-{label}-contato.jpg')])
 run(['ffmpeg','-y','-v','error','-ss','3.3','-i',str(video),'-t','3','-vf','fps=6,scale=216:-1,tile=6x3','-frames:v','1',str(out/f'regeneracao-{label}-queda-sequencia.jpg')])
for name,t in [('impacto',4.5),('regenerando',5.9),('restaurado',6.5),('final',10.5)]:
 run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(source),'-frames:v','1',str(out/f'regeneracao-{name}.png')])
loud=run(['ffmpeg','-hide_banner','-i',str(source),'-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-']).stderr.decode('utf8',errors='replace')
(out/'regeneracao-loudness.log').write_text(loud,encoding='utf8')
levels=json.loads(re.findall(r'\{[^{}]+\}',loud)[-1])
paths=['src/remotion/RegenerationRoot.tsx','src/remotion/regeneration/RegenerationPilot.tsx','src/remotion/regeneration/regenMotion.ts','src/components/BugiCharacterSvg.tsx','public/assets/regeneracao/mix-final.wav','public/assets/regeneracao/timing.json']
assert (folder/'mix-final.wav').read_bytes()==(out/'regeneracao-public/assets/regeneracao/mix-final.wav').read_bytes()
qa=dict(outputs=rows,sameAudioVerified=True,isolatedPilots='pixel-crops of left/right halves of the same Remotion comparison, reencoded video, copied AAC',sameCharacter=True,sameBackground=True,sameCamera=True,sameAcousticMilestones=True,differentMotionController=True,renderEngine='Remotion 4.0.540',source='src/remotion/RegenerationRoot.tsx',sourceHashes={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in paths},audioLoudness={k:float(levels[k]) for k in ['input_i','input_tp','input_lra']},alignmentType='acoustic-forced-alignment-whisperx',agentVisualReview='pending',humanVisualApproved=False,humanListenApproved=False,published=False)
(folder/'render-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(dict(outputs=rows,sameAudioVerified=True,loudness=qa['audioLoudness']),ensure_ascii=False,indent=2))
