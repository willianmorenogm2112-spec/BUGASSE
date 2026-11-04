# Short completo — E se o tempo parasse por cinco segundos?

## Entrega

MP4 local: `out/short-tempo-final.mp4`. Duração 50,600s, 1515 quadros, 1080×1920, 30 fps, H.264/AAC, 12.036.507 bytes. SHA256 `5E3418AD20DE6FDCD2ED900803DA667F17779B20082DB2B4F2F41CAFEEDD86E1`.

## Executado

- Voz WAV fornecida pelo usuário, preservada em `public/assets/short-tempo/narracao-original.wav`.
- Alinhamento local estimado por palavra com faster-whisper small; correções editoriais de “E se o tempo”, “cinco”, “poste” e “PÁ”.
- Composição Remotion `Bugi-Tempo-51s` com cenário SVG, rig oficial do Bugi, botão, relógio, gota, bola, congelamento, contagem, quique, impacto, títulos e legendas.
- SFX procedurais discretos para botão, congelamento, quique e impacto; mix final normalizada.
- Render principal e preview usam `TimeShort.tsx` pela mesma entrada `PilotRoot.tsx`.

## Evidência e QA

Lint e build passaram. FFmpeg decodificou o MP4 integralmente sem erros. FFprobe mediu 50,600s, 1515 quadros, 1080×1920 e 30 fps. EBU R128 mediu −14,2 LUFS e true peak −2,5 dBFS. Folha inspecionada em `qa/short-tempo/contact-sheet-final.png`.

## Limitações

Os timestamps do ASR são estimados e não equivalem a alinhamento humano certificado. O WAV não contém metadados que comprovem modelo ou voz; o manifesto registra o modelo e a voz esperados pelo prompt desta sessão, sem fingir verificação embutida. A parada do tempo é ficção; a bola retomar a trajetória é uma regra narrativa. Revisão auditiva humana e aprovação artística continuam pendentes. Não houve publicação, push ou merge.

## Rollback

Reverter os commits desta branch remove somente a composição e os registros deste Short. Os vídeos em `out/` e QA local ficam ignorados pelo Git.
