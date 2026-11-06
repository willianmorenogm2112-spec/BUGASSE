from pathlib import Path
import json,hashlib,wave
root=Path(__file__).resolve().parents[1]
folder=root/'public/assets/gravidade'
voices=[]
for speaker,voice,original in [('bugi','Puck','Generated Audio November 06, 2026 - 12_17AM.wav'),('narrador','Charon','Generated Audio November 06, 2026 - 12_13AM.wav')]:
    path=folder/f'{speaker}-{voice.lower()}.wav'
    with wave.open(str(path),'rb') as w: duration=w.getnframes()/w.getframerate();rate=w.getframerate()
    voices.append({'speaker':speaker,'voice':voice,'model':'gemini-3.8-flash-tts','generationSource':'google_ai_studio_ui','uri':'https://aistudio.google.com/u/0/generate-speech?model=gemini-3.8-flash-tts','originalDownload':original,'path':str(path.relative_to(root)).replace('\\','/'),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'durationSeconds':duration,'sampleRate':rate,'chargedCost':None,'costNote':'Interface não forneceu custo cobrado; sem chave paga selecionada.'})
data={'episode':'gravidade-dobrada','version':2,'voices':voices,'background':{'generationSource':'authored_svg_code','path':'src/remotion/gravity/GravityRoom.tsx','model':None,'note':'Cenário por código conforme preferência do usuário. Nenhuma imagem Google gerada ou alegada.'},'sfx':{'source':'original_procedural','script':'scripts/mix_gravity.py','seed':20261106,'note':'Sons sintéticos de contato e gráfico; não são usados como voz.'},'alignment':'WhisperX forced acoustic alignment, CPU, language pt','humanVisualApproved':False,'humanListenApproved':False}
(folder/'provenance.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(voices,ensure_ascii=False,indent=2))
