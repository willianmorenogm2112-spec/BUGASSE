"""Technical QA of the actual Remotion MP4, with visual evidence for manual inspection."""
from pathlib import Path
import subprocess,json,hashlib,re,sys
root=Path(__file__).resolve().parents[1];out=root/'out';folder=root/'public/assets/sono'
video=out/(sys.argv[1] if len(sys.argv)>1 else 'bugi-nunca-dormir-v3.mp4')
def run(args):
    result=subprocess.run(args,capture_output=True,text=True,encoding='utf8',errors='replace')
    if result.returncode:raise RuntimeError(result.stderr)
    return result
probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(video)]).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['codec_name'],v['r_frame_rate'],a['codec_name'])==(1080,1920,'h264','30/1','aac')
decode=run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'])
(out/'sono-v3-decode.log').write_text(decode.stderr or 'Full decode succeeded; no errors.\n',encoding='utf8')
black=run(['ffmpeg','-hide_banner','-i',str(video),'-vf','blackdetect=d=0.1:pix_th=0.1','-an','-f','null','-'])
(out/'sono-v3-blackdetect.log').write_text(black.stderr,encoding='utf8')
intervals=re.findall(r'black_start:([^ ]+) black_end:([^ ]+) black_duration:([^\r\n]+)',black.stderr)
assert not intervals,intervals
loud=run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-15:TP=-2:LRA=9:print_format=json','-f','null','-'])
(out/'sono-v3-loudness.log').write_text(loud.stderr,encoding='utf8')
loudness=json.loads(re.findall(r'\{[^{}]+\}',loud.stderr)[-1])
run(['ffmpeg','-y','-v','error','-i',str(video),'-vf','fps=1/3,scale=180:-1,tile=7x8','-frames:v','1',str(out/'sono-v3-completo-contato.jpg')])
# Adjacent frames across acted reactions and a data reveal, not only isolated keyframes.
for name,start,length in [('reacao',105.9,2.4),('carro',68.3,3.0)]:
    run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(video),'-t',str(length),'-vf','fps=5,scale=216:-1,tile=5x3','-frames:v','1',str(out/f'sono-v3-{name}-sequencia.jpg')])
for name,seconds in [('dados',42),('carro',73),('cafe',90),('planta',109),('final',150)]:
    run(['ffmpeg','-y','-v','error','-ss',str(seconds),'-i',str(video),'-frames:v','1',str(out/f'sono-v3-{name}.png')])
timing=json.loads((folder/'timing.json').read_text(encoding='utf8'))
sources=['src/remotion/SleepRoot.tsx','src/remotion/sleep/SleepEpisode.tsx','src/remotion/sleep/SleepGraphics.tsx','src/remotion/sleep/SleepDemonstrations.tsx','src/remotion/sleep/SleepRoom.tsx','src/remotion/sleep/sleepMotion.ts','src/components/BugiCharacterSvg.tsx','public/assets/sono/timing.json','public/assets/sono/mix-final.wav']
qa=dict(composition='Bugi-Nunca-Mais-Dormir',source='src/remotion/SleepRoot.tsx',engine='Remotion 4.0.540',file=str(video),sha256=hashlib.sha256(video.read_bytes()).hexdigest(),duration=float(probe['format']['duration']),size=video.stat().st_size,frames=int(v['nb_frames']),fps=v['r_frame_rate'],width=v['width'],height=v['height'],videoCodec=v['codec_name'],audioCodec=a['codec_name'],loudness={k:float(loudness[k]) for k in ['input_i','input_tp','input_lra']},fullDecodePassed=True,blackIntervals=intervals,alignmentType=timing['alignmentType'],words=len(timing['words']),turns=len(timing['turns']),sourceHashes={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in sources},autoTechnicalChecksPassed=True,agentVisualReview='pending-contact-sheets',humanVisualApproved=False,humanListenApproved=False,published=False,limitations=['ASR and forced alignment are not human listening.','Cartoon illustrates mechanisms; it is not an individual clinical model.','No external music or generated-image background was used.'])
(folder/'render-qa-v3.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in qa.items() if k not in ['sourceHashes','limitations']},ensure_ascii=False,indent=2),flush=True)
