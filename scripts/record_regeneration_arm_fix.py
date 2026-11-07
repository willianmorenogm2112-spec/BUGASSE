"""Record the measured arm-fix QA without claiming human approval."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
assets = root / 'public/assets/regeneracao'
qa_path = assets / 'render-qa-nova-base.json'
qa = json.loads(qa_path.read_text(encoding='utf8'))
qa.update(
    agentVisualReview='MP4 contact sheet at 2fps; before/after arm transition; corrected 8.6–10.4s at 20fps. No elbow-side pop observed in sampled sequence.',
    playerFrameSeekVerified=False,
    playerContinuousPlaybackVerified=False,
    playerLimitation='V3 uses the same registered composition. Player was not rechecked this revision; prior V2 seek evidence is archived separately.',
    armFix=dict(rightElbowMaxFrameStepBeforePx=215.016, rightElbowMaxFrameStepAfterPx=14.90177,
                leftElbowMaxFrameStepAfterPx=20.77761, testedRates=[30,60], reachRangePx=[90,217],
                tests='bone lengths, palm contacts, temporal continuity, walking transition and face clearance'),
    limitations=['Sampled visual review and geometry checks do not establish universal collision safety.',
                 'User liked the new direction but requested arm corrections; V3 human review pending.',
                 'No full human listening or realtime Player verification this revision.',
                 'Instant regeneration is a fictional premise.'])
qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2)+'\n', encoding='utf8')

note = '''

## Correção dos braços — 07/11/2026, V3

Executado: corrigida a trajetória das mãos e limitada a distância ombro–punho a 90–217 px, preservando os comprimentos dos ossos. A mão direita passava quase sobre o ombro: alcance mínimo de 8,397 px e salto de cotovelo de 215,016 px entre quadros em 9,067 s. Agora percorre arco abaixo do ombro; maior passo do cotovelo direito 14,902 px, esquerdo 20,778 px a 30 fps. Também suavizada a saída do balanço da caminhada em 3,05 s. A direção da nova base foi elogiada pelo usuário; a correção V3 ainda aguarda avaliação humana.

Evidência/arquivos: src/remotion/regeneration-fluid/fluidMotion.ts e fluidMotion.test.ts; scripts/qa_regeneration_fluid.py; render-qa-nova-base.json (V3), render-qa-nova-base-v2.json (histórico). Export local out/regeneracao-nova-base-v3.mp4, 12,011 s, 360 frames, 1080×1920/30, H.264/AAC, 2.945.325 bytes; SHA256 d6b13a2444bb089f7022a69b8026eeaeb816fd12ad25ace4ce16b316c5726a89. Player/export mantêm a composição Regeneracao-NovaBase; Player não rechecado nesta revisão.

Testado/logs: 6 testes de movimento passaram (incluem continuidade a 30/60 fps, folga do rosto e apoio fixo das mãos), 17 testes gerais, lint e build passaram. Logs out/regeneracao-bracos-motion-test.log, regeneracao-bracos-general-test.log, regeneracao-bracos-lint.log, regeneracao-bracos-build.log, regeneracao-bracos-qa.log e regeneracao-nova-base-v3-render.log. Decode integral sem erro, sem intervalos pretos. Áudio PCM idêntico ao anterior; -16,54 LUFS e -5,00 dBTP. Revisados contato geral a 2 fps e braços em 8,6–10,4 s a 20 fps (regeneracao-fluid-bracos-v3.jpg), comparados à sequência anterior bracos-antes.jpg. Build mantém avisos preexistentes de tamanho de bundle/import dinâmico.

Limitação/próximo: verificações de trajetória e amostras visuais não garantem ausência de qualquer colisão em futuros gestos. Reaplicar os testes ao alterar poses; avaliar V3 antes de expandir o episódio. Sem nova instalação, serviço pago, geração ou publicação. Arquivos de áudio e exports anteriores preservados. Trabalho isolado em BUGASSE-regeneracao, branch codex/regeneracao-bracos-20261107, base 3997103; rollback por reversão dos commits desta branch, sem tocar na main ou na cópia concorrente.
'''
for name in ['INSTALL-STATUS','AUDIT','RENDER-QA','CHANGES','NEXT-STEPS','REGENERACAO-NOVA-BASE']:
    with (root/f'reports/{name}.md').open('a', encoding='utf8') as f:
        f.write(note)
for name in ['AGENTS.md','docs/CONTINUIDADE-AGENTES.md']:
    with (root/name).open('a', encoding='utf8') as f:
        f.write('\n\nATUAL V3: usuário gostou da nova direção, mas exigiu corrigir os braços. Corrigido salto do cotovelo por mão quase sobre o ombro; trajetória segura e 6 testes (incluem continuidade a 30/60fps, rosto e apoio). Export out/regeneracao-nova-base-v3.mp4; QA render-qa-nova-base.json e reports/REGENERACAO-NOVA-BASE.md. Preservar esta direção e versões anteriores. V3 aguarda avaliação humana; sem publicação ou episódio completo. Branch codex/regeneracao-bracos-20261107, base 3997103.\n')
