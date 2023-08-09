import { IPluginConfig } from '@fraytools/plugin-core/lib/types';
import { ILibraryAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';

export type SymbolPreset = {
  xPositionValue: number;
  yPositionValue: number;
  xScaleValue: number;
  yScaleValue: number;
  rotationValue: number;
}

export interface IFraymakersMetadataConfig extends IPluginConfig {
    symbolPreset: SymbolPreset[];
}

export type FraymakersObjectType = 'NONE'|'ENTITY'|'CHARACTER'|'PROJECTILE'|'ASSIST'|'CUSTOM_GAME_OBJECT'|'STAGE'|'COLLISION_AREA'|'RECT_COLLISION_AREA'|'RECT_STRUCTURE'|'LINE_SEGMENT_STRUCTURE'|'MATCH_RULES';

export interface IFraymakersMetadataPluginAssetMetadata extends ILibraryAssetMetadata {
  pluginMetadata: {
    'com.fraymakers.FraymakersMetadata'?: {
      objectType:FraymakersObjectType
    }
  }
}
