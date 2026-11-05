import json
from pathlib import Path
import whisperx

root = Path(__file__).resolve().parents[1]
text = 'Tá quente pra cacete! Alguém desliga esse Sol! Pedido atendido, Bugi. Só que, no primeiro segundo… nada muda. A luz que já saiu do Sol continua viajando. Você ganha cerca de oito minutos e vinte segundos de solzinho atrasado. Acabou o prazo? Escuridão. E a Terra também deixa de sentir a atração do Sol. Ela segue aproximadamente em linha reta pelo espaço. Calma: a gravidade da Terra continua aqui. Você não sai flutuando, espertão. Nas horas seguintes, o planeta começa a perder calor. Fotossíntese sem luz solar? Parou. Mas o oxigênio não acaba de repente. Com o tempo, o frio piora. A energia guardada no planeta adia o desastre; não resolve. Bugi, era pra ligar o ventilador… não cancelar o Sistema Solar!'
audio = whisperx.load_audio(str(root/'public/assets/sol/narracao-original.wav'))
model, metadata = whisperx.load_align_model(language_code='pt', device='cpu')
result = whisperx.align([{'start':0,'end':48.36,'text':text}],model,metadata,audio,'cpu',return_char_alignments=False)
words = result['word_segments']
missing = [w['word'] for w in words if 'start' not in w or 'end' not in w]
if missing:
    raise RuntimeError(f'Unaligned words: {missing}')
def anchor(word, after=0):
    return next(w['start'] for w in words if w['word'].lower().strip('.,!?…:;')==word and w['start']>=after)
dark=anchor('escuridão')
beats=[
 ('gancho',0,'DESLIGA ESSE SOL!','AGORA'),
 ('espera',anchor('pedido'),'PEDIDO ATENDIDO.','1º SEGUNDO'),
 ('luz',anchor('a',6),'SOLZINHO ATRASADO.','≈ 8 MIN 20 S DE VIAGEM'),
 ('escuro',dark,'ACABOU A LUZ.','≈ 8 MIN 20 S DEPOIS'),
 ('orbita',anchor('ela'),'A TERRA SEGUE VIAGEM.','SEM A ATRAÇÃO DO SOL'),
 ('gravidade',anchor('calma'),'SEU PÉ CONTINUA NO CHÃO.','A GRAVIDADE DA TERRA FICA'),
 ('frio',anchor('nas'),'O CALOR VAI EMBORA.','NAS HORAS SEGUINTES'),
 ('plantas',anchor('fotossíntese'),'SEM SOL, SEM FOTOSSÍNTESE.','O OXIGÊNIO NÃO SOME NA HORA'),
 ('frio',anchor('com'),'O FRIO SÓ PIORA.','COM O TEMPO'),
 ('final',anchor('bugi',38),'ERA SÓ UM VENTILADOR!','BUGI: ARREPENDIMENTO')]
data={'alignmentType':'acoustic-forced-alignment-reviewed-text','duration':48.36,'dark':dark,'words':words,'beats':[dict(id=i,start=s,title=t,label=l) for i,s,t,l in beats]}
(root/'public/assets/sol/timing.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print('aligned',len(words),'words; dark',dark)
