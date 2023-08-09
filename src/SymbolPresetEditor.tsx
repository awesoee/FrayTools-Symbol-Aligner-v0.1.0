import * as React from 'react';
import * as _ from 'lodash';
import './SymbolPresetEditor.scss';
import * as uuid from 'uuid';
import { SymbolPreset } from './types';
import { render } from 'react-dom';
import SymbolAlignerPlugin from './SymbolAligner';

interface SymbolPresetEditorProps {
    symbolPresets:SymbolPreset[];
    onUpdated:(SymbolPreset:SymbolPreset[]) => number
  }
  
  interface SymbolPresetEditorState {
    symbolPresets?:SymbolPreset[];
  }

  export default class SymbolPresetEditor extends React.Component<SymbolPresetEditorProps, SymbolPresetEditorState> {
    xPositionPresetField:React.RefObject<HTMLInputElement>;
    yPositionPresetField:React.RefObject<HTMLInputElement>;
    xScalePresetField:React.RefObject<HTMLInputElement>;
    yScalePresetField:React.RefObject<HTMLInputElement>;
    rotationPresetField:React.RefObject<HTMLInputElement>;

    constructor(props) {
      super(props);
  
      this.state = {
        symbolPresets: this.props.symbolPresets || []
      };
  
      this.xPositionPresetField = React.createRef();
      this.yPositionPresetField = React.createRef();
      this.xScalePresetField = React.createRef();
      this.yScalePresetField = React.createRef();
      this.rotationPresetField = React.createRef();
    }

    public static getDefaults() {
        return {
            xPositionValue: 0,
            yPositionValue: 0,
            xScaleValue: 1,
            yScaleValue: 1,
            rotationValue: 0
        }
    } 


      addSymbolPresets(event:React.MouseEvent<HTMLButtonElement>) {
        if (!this.xPositionPresetField.current.value || !this.yPositionPresetField.current.value || !this.xScalePresetField.current.value || !this.yScalePresetField.current.value || !this.rotationPresetField.current.value) {
          return;
        }
        this.setState({
          symbolPresets: [...this.state.symbolPresets, {
            xPositionValue: parseFloat(this.xPositionPresetField.current.value),
            yPositionValue: parseFloat(this.yPositionPresetField.current.value),
            xScaleValue: parseFloat(this.xScalePresetField.current.value),
            yScaleValue: parseFloat(this.yScalePresetField.current.value),
            rotationValue: parseFloat(this.rotationPresetField.current.value)
          }]
        }, () => {
    //    this.xPositionPresetField.current.value = '';
          this.onUpdated();
        });
      }

      onUpdated() {
        this.props.onUpdated(this.state.symbolPresets);
      }

      onPresetEdited(presetToUpdate:SymbolPreset) {
        this.setState({
          symbolPresets: _.map(this.state.symbolPresets, (preset) => {
            if (preset.xPositionValue === presetToUpdate.xPositionValue || preset.yPositionValue === presetToUpdate.yPositionValue ) {
              return presetToUpdate;
            }
            return preset;
          })
        }, () => {
          this.onUpdated();
        });
      }

      onPresetRemoved(presetToRemove:SymbolPreset) {
        this.setState({
          symbolPresets: _.filter([...this.state.symbolPresets ], (p) => {
            return p.yPositionValue !== presetToRemove.yPositionValue;
          })
        }, () => {
          this.onUpdated();
        });
      }

    public render() {
        return (
      <div>
          <div>

            <fieldset className='positionFieldSet'>
              <legend><b>Position</b></legend>
              <table className='positionTable'>
                <tr className='positionTableRow'>
                  <td>
                    <label htmlFor='xPositionInput'><h2>X Position</h2></label>
                    <input className='customInput' ref={this.xPositionPresetField} type='number' id='xPositionInput' placeholder='' />
                  </td>
                  <td>
                    <label htmlFor='yPositionInput'><h2>Y Position</h2></label>
                    <input className='customInput' ref={this.yPositionPresetField} type='number' id='yPositionInput' placeholder='' />
                  </td>
                </tr>
              </table>
            </fieldset>

            <fieldset className='scaleFieldSet'>
              <legend><b>Scale</b></legend>
              <table className='scaleTable'>
                <tr className='scaleTableRow'>
                    <td>
                      <label htmlFor='xScaleInput'><h2>X Scale</h2></label>
                      <input className='customInput' ref={this.xScalePresetField} type='number' id='xScaleInput' placeholder='' />
                    </td>
                    <td>
                      <label htmlFor='yScaleInput'><h2>Y Scale</h2></label>
                      <input className='customInput' ref={this.yScalePresetField} type='number' id='yScaleInput' placeholder='' />
                    </td>
                  </tr>
              </table>
            </fieldset>

            <fieldset className='rotationFieldSet'>
              <legend><b>Rotation</b></legend>
              <table className='rotationTable'>
                <tr className='rotationTableRow'>
                    <td>
                      <label htmlFor='rotationInput'><h2>Rotation</h2></label>
                      <input className='customInput' ref={this.rotationPresetField} type='number' min={0} max={360} id='rotationInput' placeholder='' />
                      <br/>
                    </td>
                </tr>
              </table>
            </fieldset>

            <button className='saveButton' onClick={this.addSymbolPresets.bind(this)}>Save</button>

            <p id="valuestorage"></p>
          </div>      
        </div>
        );
    }
}