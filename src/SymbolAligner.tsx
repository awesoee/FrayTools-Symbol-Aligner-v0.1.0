import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
// Import FrayToolsPluginCore.js and BaseMetadataDefinitionPlugin.js
import './SymbolAligner.scss';
import SymbolPresetEditor from './SymbolPresetEditor';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseTypeDefinitionPlugin, { IMetadataDefinitionPluginProps, IMetadataDefinitionPluginState } from '@fraytools/plugin-core/lib/base/BaseMetadataDefinitionPlugin';
import { IManifestJson, IMetadataDefinition, IMetadataDefinitionConditional, IMetadataDefinitionDropdownFieldData, IMetadataDefinitionDropdownFieldDataOptions, IMetadataDefinitionEffect } from '@fraytools/plugin-core/lib/types';
import { SymbolPreset, IFraymakersMetadataConfig, IFraymakersMetadataPluginAssetMetadata } from './types';
import { ILibraryAssetMetadata, ISpriteEntityAssetMetadata, KeyframeTypes, LayerTypes } from '@fraytools/plugin-core/lib/types/fraytools';
import { version } from 'html-webpack-plugin';

const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

interface IFraymakersMetadataProps extends IMetadataDefinitionPluginProps {
  configMetadata:IFraymakersMetadataConfig;
  assetMetadata: IFraymakersMetadataPluginAssetMetadata;
}
interface IFraymakersMetadataState extends IMetadataDefinitionPluginState {
  symbolPreset: SymbolPreset[];
}

/**
 * Example view for the metadata definition plugin.
 * Note: Types plugins run hidden in the background and thus will not be visible.
 */
export default class SymbolAlignerPlugin extends BaseTypeDefinitionPlugin<IFraymakersMetadataProps, IFraymakersMetadataState> {  

  constructor(props) {
    super(props);


    this.state = {
      symbolPreset: this.props.configMetadata.symbolPreset || []
    };

  }

  public static getDefaultSettings():IFraymakersMetadataConfig {
    return {
      version: MANIFEST_JSON.version,
      symbolPreset: []
    };
  }
  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<SymbolAlignerPlugin {...props} />, document.querySelector('.SymbolAlignerWrapper'));
  }


  /**
   * Send metadata definition collection data here. This function will be called automatically when a 'getMetadataDefinitionConfig' message is received via postMessage().
   * @returns 
   */
  onMetadataDefinitionRequest() {
    // Return metadata definitions

    // Check /src/types/index in the Fraytools Plugin Core for a list of every available metadataOwnerType
    FrayToolsPluginCore.sendMetadataDefinitions([
      {
        metadataOwnerTypes: ['IMAGE_SYMBOL_METADATA'],
        fields: [{
          name: 'symbolPresetBoolean',
          label: 'Use Preset(s)',
          type: 'BOOLEAN',
          defaultValue: false,  
          dependsOn: []
        }],
        effects: this.getSymbolPresetEffects([])
      },
    ]);
  }
  /**
   * Send fields to overwrite metadata on the current asset. 
   */
  onAssetMetadataMigrationRequest() {
    var tags = this.props.assetMetadata.tags;
    // We will add a custom tag to the asset using a migration.
    if (this.props.assetMetadata.tags.indexOf('custom') < 0) {
      tags.push('custom');
    } else {
      // Pass null to inform FrayTools no migration is required
      FrayToolsPluginCore.sendAssetMetadataMigrations(null);
      return;
    }
    FrayToolsPluginCore.sendAssetMetadataMigrations({
      tags: tags
    } as ILibraryAssetMetadata);
  }

  /**
   * Given all of the Collision Body Layer Presets defined by the user, generates the corresponding effects so that the defaults for the layer will be overwritten accordingly when the user chooses a preset.
   * @param effects 
   * @returns 
   */
  getSymbolPresetEffects(effects:IMetadataDefinitionEffect[]) {
    _.each(this.state.symbolPreset, (preset) => {
      effects = [...effects, ...this.getEffectsFromSymbolPreset(preset) ];
    });
    return effects;
  }
  /**
   * Helper method for getCollisionBodyLayerPresetEffects() which creates an effect for every relevant defaults field on the Collision Body Layer.
   * @param preset 
   * @returns 
   */
  getEffectsFromSymbolPreset(preset:SymbolPreset):IMetadataDefinitionEffect[] {
    let effects:IMetadataDefinitionEffect[] = [];
    let dependsOn:IMetadataDefinitionConditional[] = [{
      inputField: 'pluginMetadata[].symbolPresetBoolean',
      operator: '=',
      inputValue: true
    }];
    effects.push({ dependsOn: dependsOn, outputField: 'x', outputValue: preset.xPositionValue });   
    effects.push({ dependsOn: dependsOn, outputField: 'y', outputValue: preset.yPositionValue }); 
    effects.push({ dependsOn: dependsOn, outputField: 'scaleX', outputValue: preset.xScaleValue });   
    effects.push({ dependsOn: dependsOn, outputField: 'scaleY', outputValue: preset.yScaleValue }); 
    effects.push({ dependsOn: dependsOn, outputField: 'rotation', outputValue: preset.rotationValue });       
    return effects;
  }
  
  onSymbolPresetsUpdated(SymbolPreset:SymbolPreset[]) {
    // Assign new presets
    let configClone = {...this.props.configMetadata };
    configClone.symbolPreset = SymbolPreset;
    FrayToolsPluginCore.configMetadataSync(configClone);
  }


public render() {
    if (this.props.configMode) {

      const valueStoring = ""
      // If configMode is enabled, display a different view specifically for configuring the plugin
      return (
        <>
        <body style={{ backgroundColor: "#111111", }}>
            <div className="symbolPresetContainer">
              <h2 className='title'>Awesome's Symbol Aligner v{MANIFEST_JSON.version}</h2> <br/>
              <div className='container'>
                <div className='row'>
                  <div className="col-sm-12">
                    <p>Currently, you need to fill out every form in order for the preset button to work.</p>
                    {valueStoring}
                    <SymbolPresetEditor
                      symbolPresets={this.props.configMetadata.symbolPreset}
                      onUpdated={this.onSymbolPresetsUpdated.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </body>
          </> 
      );
    }

    // Note: MetadataDefinitionPlugins that aren't in config mode run in the background and thus do not display a view while active
    return <div/>;
  }
}



