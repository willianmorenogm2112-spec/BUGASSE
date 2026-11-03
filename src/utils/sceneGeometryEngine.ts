/**
 * SceneGeometryEngine — Motor de Camadas, Polígonos, Proporções e Colisões 2D
 * Canvas de referência lógico fixo: 1080 × 1920 (9:16 Vertical).
 */

import {
  NormalizedPoint2D,
  SceneBoundingBox,
  SceneGeometryObject,
  SceneGeometrySpec,
  SceneLayerName,
  StoryboardScene,
} from '../types/studio';

export const LOGICAL_CANVAS_WIDTH = 1080;
export const LOGICAL_CANVAS_HEIGHT = 1920;
export const DEFAULT_GROUND_LINE_Y = 1370; // Equivalente a y=685 em 540x960 escalado 2x
export const SAFE_ZONE_TOP_PX = 180;
export const SAFE_ZONE_BOTTOM_PX = 380;

export const ORDERED_SCENE_LAYERS: SceneLayerName[] = [
  'Fundo distante',
  'Cenário intermediário',
  'Elementos próximos',
  'Superfície do chão',
  'Objetos interativos',
  'Personagem Bugi',
  'Partículas e efeitos',
  'Legendas',
];

export const LAYER_DEPTH_MAP: Record<SceneLayerName, number> = {
  'Fundo distante': 10,
  'Cenário intermediário': 20,
  'Elementos próximos': 30,
  'Superfície do chão': 40,
  'Objetos interativos': 50,
  'Personagem Bugi': 60,
  'Partículas e efeitos': 70,
  'Legendas': 80,
};

/**
 * Converte coordenadas lógicas (1080x1920) para um SceneBoundingBox normalizado + pixels
 */
export function createBoundingBoxFromPixels(
  pxX: number,
  pxY: number,
  pxWidth: number,
  pxHeight: number
): SceneBoundingBox {
  const safeX = Math.max(0, Math.min(LOGICAL_CANVAS_WIDTH, pxX));
  const safeY = Math.max(0, Math.min(LOGICAL_CANVAS_HEIGHT, pxY));
  const safeW = Math.max(1, Math.min(LOGICAL_CANVAS_WIDTH - safeX, pxWidth));
  const safeH = Math.max(1, Math.min(LOGICAL_CANVAS_HEIGHT - safeY, pxHeight));

  return {
    normX: Number((safeX / LOGICAL_CANVAS_WIDTH).toFixed(4)),
    normY: Number((safeY / LOGICAL_CANVAS_HEIGHT).toFixed(4)),
    normWidth: Number((safeW / LOGICAL_CANVAS_WIDTH).toFixed(4)),
    normHeight: Number((safeH / LOGICAL_CANVAS_HEIGHT).toFixed(4)),
    pxX: Math.round(safeX),
    pxY: Math.round(safeY),
    pxWidth: Math.round(safeW),
    pxHeight: Math.round(safeH),
  };
}

/**
 * Extrai um contorno poligonal geométrico válido a partir de uma matriz de transparência/alfa
 * (0 = transparente, >0 = opaco). Garante ao menos um polígono convexo/simplificado de 4 a 8 vértices.
 */
export function extractGeometricContourFromAlphaGrid(
  alphaGrid: number[][],
  gridWidth: number,
  gridHeight: number
): NormalizedPoint2D[] {
  if (!alphaGrid || alphaGrid.length === 0 || gridWidth <= 0 || gridHeight <= 0) {
    return [
      { x: 0.1, y: 0.1 },
      { x: 0.9, y: 0.1 },
      { x: 0.9, y: 0.9 },
      { x: 0.1, y: 0.9 },
    ];
  }

  let minX = gridWidth;
  let maxX = 0;
  let minY = gridHeight;
  let maxY = 0;
  let opaqueCount = 0;

  for (let y = 0; y < Math.min(gridHeight, alphaGrid.length); y++) {
    const row = alphaGrid[y] || [];
    for (let x = 0; x < Math.min(gridWidth, row.length); x++) {
      if ((row[x] ?? 0) > 16) {
        opaqueCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (opaqueCount === 0 || minX > maxX || minY > maxY) {
    return [
      { x: 0.15, y: 0.15 },
      { x: 0.85, y: 0.15 },
      { x: 0.85, y: 0.85 },
      { x: 0.15, y: 0.85 },
    ];
  }

  // Extrai um octógono geométrico ajustado à silhueta opaca detectada
  const nx0 = Number((minX / gridWidth).toFixed(4));
  const nx1 = Number(((maxX + 1) / gridWidth).toFixed(4));
  const ny0 = Number((minY / gridHeight).toFixed(4));
  const ny1 = Number(((maxY + 1) / gridHeight).toFixed(4));
  const midX = Number(((nx0 + nx1) / 2).toFixed(4));
  const midY = Number(((ny0 + ny1) / 2).toFixed(4));
  const insetX = Number(((nx1 - nx0) * 0.12).toFixed(4));
  const insetY = Number(((ny1 - ny0) * 0.12).toFixed(4));

  return [
    { x: Number((nx0 + insetX).toFixed(4)), y: ny0 },
    { x: midX, y: ny0 },
    { x: Number((nx1 - insetX).toFixed(4)), y: ny0 },
    { x: nx1, y: midY },
    { x: Number((nx1 - insetX * 0.5).toFixed(4)), y: ny1 },
    { x: midX, y: ny1 },
    { x: Number((nx0 + insetX * 0.5).toFixed(4)), y: ny1 },
    { x: nx0, y: midY },
  ];
}

/**
 * Gera a estrutura geométrica de 8 camadas para uma cena do Storyboard
 */
export function buildSceneGeometryForScene(
  scene: StoryboardScene,
  customBackgroundUrl?: string
): SceneGeometrySpec {
  const groundLinePxY = DEFAULT_GROUND_LINE_Y;
  const isFloatingPose =
    scene.bugiPose === 'flutuando' || scene.bugiPose === 'pulando';
  const isCrouchingPose = scene.bugiPose === 'agachando';
  const bugiHeightPx = isCrouchingPose ? 540 : 680;
  const bugiWidthPx = 280;
  const bugiGroundContactY = isFloatingPose
    ? groundLinePxY - 190
    : groundLinePxY;
  const bugiTopPxY = bugiGroundContactY - bugiHeightPx;
  const bugiLeftPxX = 540 - bugiWidthPx / 2;

  const objects: SceneGeometryObject[] = [
    {
      id: `obj-${scene.id}-far-bg`,
      name: `Fundo Distante (${scene.scenarioPreset})`,
      layer: 'Fundo distante',
      assetIdOrUrl:
        customBackgroundUrl ||
        scene.generatedBackgroundUrl ||
        `preset:${scene.scenarioPreset}:sky`,
      boundingBox: createBoundingBoxFromPixels(0, 0, 1080, 1920),
      polygonMask: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      maskSource: 'simplified_vector_layer',
      depth: LAYER_DEPTH_MAP['Fundo distante'],
      anchorPoint: { x: 0.5, y: 0.5 },
      originalScale: 1.0,
      scaleLimits: [1.0, 1.35],
      position: { x: 540, y: 960 },
      rotation: 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 2.82,
      interactionType: 'estatico',
    },
    {
      id: `obj-${scene.id}-mid-scenery`,
      name: `Arquitetura / Ambiente Intermediário (${scene.scenario})`,
      layer: 'Cenário intermediário',
      assetIdOrUrl: `preset:${scene.scenarioPreset}:midground`,
      boundingBox: createBoundingBoxFromPixels(40, 240, 1000, 1130),
      polygonMask: [
        { x: 0.04, y: 0.125 },
        { x: 0.96, y: 0.125 },
        { x: 0.96, y: 0.713 },
        { x: 0.04, y: 0.713 },
      ],
      maskSource: 'geometric_alpha_contour',
      depth: LAYER_DEPTH_MAP['Cenário intermediário'],
      anchorPoint: { x: 0.5, y: 1.0 },
      originalScale: 1.0,
      scaleLimits: [0.85, 1.25],
      position: { x: 540, y: groundLinePxY },
      rotation: 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 1.66,
      interactionType: 'estatico',
    },
    {
      id: `obj-${scene.id}-near-elements`,
      name: 'Elementos Próximos de Profundidade (Postes / Bancada)',
      layer: 'Elementos próximos',
      assetIdOrUrl: `preset:${scene.scenarioPreset}:near`,
      boundingBox: createBoundingBoxFromPixels(780, 760, 220, 610),
      polygonMask: [
        { x: 0.72, y: 0.39 },
        { x: 0.92, y: 0.39 },
        { x: 0.92, y: 0.713 },
        { x: 0.72, y: 0.713 },
      ],
      maskSource: 'geometric_alpha_contour',
      depth: LAYER_DEPTH_MAP['Elementos próximos'],
      anchorPoint: { x: 0.5, y: 1.0 },
      originalScale: 1.0,
      scaleLimits: [0.8, 1.2],
      position: { x: 890, y: groundLinePxY },
      rotation: 0,
      groundContactPoint: { x: 890, y: groundLinePxY },
      proportionToBugi: 0.9,
      interactionType: 'estatico',
    },
    {
      id: `obj-${scene.id}-ground`,
      name: 'Superfície Física do Chão (Linha de Contato)',
      layer: 'Superfície do chão',
      assetIdOrUrl: `preset:${scene.scenarioPreset}:ground`,
      boundingBox: createBoundingBoxFromPixels(
        0,
        groundLinePxY,
        1080,
        1920 - groundLinePxY
      ),
      polygonMask: [
        { x: 0, y: Number((groundLinePxY / 1920).toFixed(4)) },
        { x: 1, y: Number((groundLinePxY / 1920).toFixed(4)) },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      maskSource: 'simplified_vector_layer',
      depth: LAYER_DEPTH_MAP['Superfície do chão'],
      anchorPoint: { x: 0.5, y: 0.0 },
      originalScale: 1.0,
      scaleLimits: [1.0, 1.15],
      position: { x: 540, y: groundLinePxY },
      rotation: 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 0.81,
      interactionType: 'colisivel',
    },
    {
      id: `obj-${scene.id}-prop-interactive`,
      name: 'Objeto Interativo de Cena (Placa μ=0 / Obstáculo Experimental)',
      layer: 'Objetos interativos',
      assetIdOrUrl:
        scene.isolatedObjectUrls?.[0] || `prop:${scene.scenarioPreset}:interactive`,
      boundingBox: createBoundingBoxFromPixels(780, groundLinePxY - 250, 180, 250),
      polygonMask: [
        { x: 0.72, y: 0.58 },
        { x: 0.89, y: 0.58 },
        { x: 0.89, y: 0.713 },
        { x: 0.72, y: 0.713 },
      ],
      maskSource: 'geometric_alpha_contour',
      depth: LAYER_DEPTH_MAP['Objetos interativos'],
      anchorPoint: { x: 0.5, y: 1.0 },
      originalScale: 1.0,
      scaleLimits: [0.6, 1.35],
      position: { x: 870, y: groundLinePxY },
      rotation: 0,
      groundContactPoint: { x: 870, y: groundLinePxY },
      proportionToBugi: 0.37,
      interactionType:
        scene.bugiPose === 'escorregando' ? 'deslizante' : 'colisivel',
    },
    {
      id: `obj-${scene.id}-bugi`,
      name: 'Personagem Principal Canônico — Bugi (Rig Articulado SVG)',
      layer: 'Personagem Bugi',
      assetIdOrUrl: 'assets/bugi-canonical-rig.svg',
      boundingBox: createBoundingBoxFromPixels(
        bugiLeftPxX,
        bugiTopPxY,
        bugiWidthPx,
        bugiHeightPx
      ),
      polygonMask: [
        { x: 0.42, y: Number((bugiTopPxY / 1920).toFixed(4)) },
        { x: 0.58, y: Number((bugiTopPxY / 1920).toFixed(4)) },
        { x: 0.63, y: Number(((bugiTopPxY + 340) / 1920).toFixed(4)) },
        { x: 0.6, y: Number((bugiGroundContactY / 1920).toFixed(4)) },
        { x: 0.4, y: Number((bugiGroundContactY / 1920).toFixed(4)) },
        { x: 0.37, y: Number(((bugiTopPxY + 340) / 1920).toFixed(4)) },
      ],
      maskSource: 'geometric_alpha_contour',
      depth: LAYER_DEPTH_MAP['Personagem Bugi'],
      anchorPoint: { x: 0.5, y: 1.0 },
      originalScale: 1.0,
      scaleLimits: [0.75, 1.25],
      position: { x: 540, y: bugiGroundContactY },
      rotation: scene.bugiPose === 'escorregando' ? -16 : scene.bugiPose === 'caindo' ? -28 : 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 1.0,
      interactionType: 'personagem_principal',
    },
    {
      id: `obj-${scene.id}-particles`,
      name: 'Partículas Físicas, Vetores e Infográficos HyperFrames',
      layer: 'Partículas e efeitos',
      assetIdOrUrl: 'effects:physics-vectors-and-sparks',
      boundingBox: createBoundingBoxFromPixels(120, 980, 840, 420),
      polygonMask: [
        { x: 0.11, y: 0.51 },
        { x: 0.89, y: 0.51 },
        { x: 0.89, y: 0.73 },
        { x: 0.11, y: 0.73 },
      ],
      maskSource: 'simplified_vector_layer',
      depth: LAYER_DEPTH_MAP['Partículas e efeitos'],
      anchorPoint: { x: 0.5, y: 0.5 },
      originalScale: 1.0,
      scaleLimits: [0.8, 1.3],
      position: { x: 540, y: 1190 },
      rotation: 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 0.62,
      interactionType: 'flutuante',
    },
    {
      id: `obj-${scene.id}-captions`,
      name: 'Legendas Dinâmicas Skill Reel (Zona Segura Shorts)',
      layer: 'Legendas',
      assetIdOrUrl: 'captions:skill-reel-safe-zone',
      boundingBox: createBoundingBoxFromPixels(56, 1460, 968, 250),
      polygonMask: [
        { x: 0.0518, y: 0.7604 },
        { x: 0.9481, y: 0.7604 },
        { x: 0.9481, y: 0.8906 },
        { x: 0.0518, y: 0.8906 },
      ],
      maskSource: 'simplified_vector_layer',
      depth: LAYER_DEPTH_MAP['Legendas'],
      anchorPoint: { x: 0.5, y: 0.5 },
      originalScale: 1.0,
      scaleLimits: [0.9, 1.1],
      position: { x: 540, y: 1585 },
      rotation: 0,
      groundContactPoint: { x: 540, y: groundLinePxY },
      proportionToBugi: 0.36,
      interactionType: 'hud_safe_zone',
    },
  ];

  return {
    sceneId: scene.id,
    canvasWidth: LOGICAL_CANVAS_WIDTH,
    canvasHeight: LOGICAL_CANVAS_HEIGHT,
    groundLinePxY,
    safeZoneTopPx: SAFE_ZONE_TOP_PX,
    safeZoneBottomPx: SAFE_ZONE_BOTTOM_PX,
    layersOrder: [...ORDERED_SCENE_LAYERS],
    objects,
  };
}

/**
 * Valida a geometria da cena:
 * - Dimensões fixas 1080x1920
 * - Ordem estrita das 8 camadas
 * - Presença do Bugi na camada 'Personagem Bugi' sem flutuação involuntária
 * - Legendas respeitando a zona segura inferior
 */
export function validateSceneGeometry(
  geometry: SceneGeometrySpec,
  pose: StoryboardScene['bugiPose'] = 'caminhando'
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    geometry.canvasWidth !== LOGICAL_CANVAS_WIDTH ||
    geometry.canvasHeight !== LOGICAL_CANVAS_HEIGHT
  ) {
    errors.push(
      `Canvas de referência inválido (${geometry.canvasWidth}×${geometry.canvasHeight}). Esperado 1080×1920.`
    );
  }

  if (geometry.layersOrder.length !== ORDERED_SCENE_LAYERS.length) {
    errors.push('A estrutura de cena deve conter todas as 8 camadas obrigatórias.');
  } else {
    ORDERED_SCENE_LAYERS.forEach((expectedLayer, idx) => {
      if (geometry.layersOrder[idx] !== expectedLayer) {
        errors.push(
          `Ordem de camada incorreta no índice ${idx}: esperado "${expectedLayer}", recebido "${geometry.layersOrder[idx]}".`
        );
      }
    });
  }

  // Verifica ordenação por depth dos objetos
  for (let i = 1; i < geometry.objects.length; i++) {
    if (geometry.objects[i].depth < geometry.objects[i - 1].depth) {
      errors.push(
        `Profundidade fora de ordem entre "${geometry.objects[i - 1].name}" e "${geometry.objects[i].name}".`
      );
    }
  }

  const bugiObj = geometry.objects.find((o) => o.layer === 'Personagem Bugi');
  if (!bugiObj) {
    errors.push('Objeto do personagem Bugi ausente na camada "Personagem Bugi".');
  } else {
    if (bugiObj.proportionToBugi !== 1.0) {
      errors.push('A proporção base do Bugi em relação a si mesmo deve ser 1.0.');
    }
    const [minScale, maxScale] = bugiObj.scaleLimits;
    if (bugiObj.originalScale < minScale || bugiObj.originalScale > maxScale) {
      errors.push(
        `Escala do Bugi (${bugiObj.originalScale}) fora dos limites permitidos [${minScale}, ${maxScale}].`
      );
    }
    const isAerialPose = pose === 'flutuando' || pose === 'pulando';
    if (!isAerialPose && Math.abs(bugiObj.position.y - geometry.groundLinePxY) > 12) {
      errors.push(
        `Bugi está flutuando ou afundando involuntariamente (y=${bugiObj.position.y}, chão=${geometry.groundLinePxY}).`
      );
    }
  }

  const captionObj = geometry.objects.find((o) => o.layer === 'Legendas');
  if (!captionObj) {
    errors.push('Camada de Legendas ausente na geometria da cena.');
  } else {
    const captionBottom =
      captionObj.boundingBox.pxY + captionObj.boundingBox.pxHeight;
    if (
      captionObj.boundingBox.pxY < geometry.safeZoneTopPx ||
      captionBottom > LOGICAL_CANVAS_HEIGHT - 120
    ) {
      errors.push(
        'A caixa de legendas viola as margens seguras verticais do formato 1080×1920.'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Resolve colisões geométricas simplificadas e garante contato com o chão
 */
export function resolveSimplifiedCollision(
  bugiObj: SceneGeometryObject,
  interactiveObj: SceneGeometryObject,
  groundLinePxY: number,
  allowAerial: boolean
): {
  clampedBugiY: number;
  collidingWithProp: boolean;
  separationDeltaX: number;
} {
  const clampedBugiY = allowAerial
    ? Math.min(groundLinePxY, bugiObj.position.y)
    : groundLinePxY;

  const bugiLeft = bugiObj.boundingBox.pxX;
  const bugiRight = bugiObj.boundingBox.pxX + bugiObj.boundingBox.pxWidth;
  const bugiTop = bugiObj.boundingBox.pxY;
  const bugiBottom = bugiObj.boundingBox.pxY + bugiObj.boundingBox.pxHeight;

  const propLeft = interactiveObj.boundingBox.pxX;
  const propRight =
    interactiveObj.boundingBox.pxX + interactiveObj.boundingBox.pxWidth;
  const propTop = interactiveObj.boundingBox.pxY;
  const propBottom =
    interactiveObj.boundingBox.pxY + interactiveObj.boundingBox.pxHeight;

  const overlapX = Math.min(bugiRight, propRight) - Math.max(bugiLeft, propLeft);
  const overlapY = Math.min(bugiBottom, propBottom) - Math.max(bugiTop, propTop);
  const collidingWithProp = overlapX > 0 && overlapY > 0;

  return {
    clampedBugiY,
    collidingWithProp,
    separationDeltaX: collidingWithProp ? -overlapX : 0,
  };
}

/**
 * Permite regenerar a máscara, ajustar limites, usar camada simplificada ou marcar segmentação SAM 2
 */
export function updateGeometryObjectMaskMode(
  geometry: SceneGeometrySpec,
  objectId: string,
  action: 'regenerate_contour' | 'adjust_bounds' | 'simplified_layer' | 'sam2_segmented'
): SceneGeometrySpec {
  return {
    ...geometry,
    objects: geometry.objects.map((obj) => {
      if (obj.id !== objectId) return obj;
      if (action === 'simplified_layer') {
        return {
          ...obj,
          maskSource: 'simplified_vector_layer',
          polygonMask: [
            { x: obj.boundingBox.normX, y: obj.boundingBox.normY },
            {
              x: Number((obj.boundingBox.normX + obj.boundingBox.normWidth).toFixed(4)),
              y: obj.boundingBox.normY,
            },
            {
              x: Number((obj.boundingBox.normX + obj.boundingBox.normWidth).toFixed(4)),
              y: Number((obj.boundingBox.normY + obj.boundingBox.normHeight).toFixed(4)),
            },
            {
              x: obj.boundingBox.normX,
              y: Number((obj.boundingBox.normY + obj.boundingBox.normHeight).toFixed(4)),
            },
          ],
        };
      }
      if (action === 'sam2_segmented') {
        return {
          ...obj,
          maskSource: 'sam2_segmented',
        };
      }
      if (action === 'adjust_bounds') {
        const clampedScale = Math.max(
          obj.scaleLimits[0],
          Math.min(obj.scaleLimits[1], obj.originalScale)
        );
        return {
          ...obj,
          originalScale: clampedScale,
          position: {
            x: obj.position.x,
            y:
              obj.layer === 'Personagem Bugi' || obj.layer === 'Objetos interativos'
                ? geometry.groundLinePxY
                : obj.position.y,
          },
        };
      }
      // regenerate_contour
      const sampleAlpha = Array.from({ length: 12 }, (_, r) =>
        Array.from({ length: 12 }, (__, c) =>
          r >= 1 && r <= 10 && c >= 2 && c <= 9 ? 255 : 0
        )
      );
      return {
        ...obj,
        maskSource: 'geometric_alpha_contour',
        polygonMask: extractGeometricContourFromAlphaGrid(sampleAlpha, 12, 12),
      };
    }),
  };
}
