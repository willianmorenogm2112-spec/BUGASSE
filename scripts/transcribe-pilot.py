"""Local ASR word estimates, not a human-certified forced alignment. Requires cached small model."""
import json
import wave
from pathlib import Path
import numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parents[1]
with wave.open(str(root/'public/assets/pilot-atrito-v1/narration-original.wav')) as wav:
    assert wav.getnchannels() == 1 and wav.getsampwidth() == 2
    audio = np.frombuffer(wav.readframes(wav.getnframes()), dtype=np.int16).astype(np.float32)/32768
    rate = wav.getframerate()
    import math
    common = math.gcd(rate, 16000)
    audio = resample_poly(audio, 16000//common, rate//common)
model = WhisperModel('small', device='cpu', compute_type='int8', local_files_only=True, cpu_threads=4)
segments, _ = model.transcribe(audio, language='pt', word_timestamps=True, beam_size=5,
                               vad_filter=False, initial_prompt='Bugi, atrito, inercia.')
words = [dict(text=w.word.strip(), start=w.start, end=w.end, probability=w.probability)
         for segment in segments for w in segment.words]
target = root/'qa/pilot-atrito-v1/transcript-whisper-small.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(words, ensure_ascii=False, indent=2), encoding='utf-8')
print(target)
