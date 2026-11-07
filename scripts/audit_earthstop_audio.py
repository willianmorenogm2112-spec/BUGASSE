"""Independent ASR audit of the actual mix (not the forced-alignment transcript)."""
from pathlib import Path
import json
import wave
import numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
folder=Path(__file__).resolve().parents[1]/'public/assets/terra-1s'
model=WhisperModel('base',device='cpu',compute_type='int8',cpu_threads=3,local_files_only=True)
with wave.open(str(folder/'mix-final.wav'),'rb') as wav:
    assert wav.getframerate()==48000 and wav.getnchannels()==1
    audio=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(np.float32)/32768
audio=resample_poly(audio,1,3).astype(np.float32)
segments,info=model.transcribe(audio,language='pt',beam_size=3,vad_filter=True)
rows=[dict(start=s.start,end=s.end,text=s.text) for s in segments]
(folder/'asr-audit.json').write_text(json.dumps(dict(model='faster-whisper-base',language=info.language,segments=rows,limitation='ASR independente; não substitui escuta humana ou revisão humana.'),ensure_ascii=False,indent=2),encoding='utf8')
for row in rows:print(f"{row['start']:.1f}–{row['end']:.1f}: {row['text']}",flush=True)
