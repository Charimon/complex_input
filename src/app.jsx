import React from 'react'
import ReactDOM from 'react-dom';

import {List, Map} from 'immutable'

import ComplexInput from './complexInput.jsx'


var options = List([
  Map({code: "US", name: "United States"}),
  Map({code: "CA", name: "Canada"}),
  Map({code: "RU", name: "Russia"}),
  Map({code: "DE", name: "Germany"}),
  Map({code: "FR", name: "France"}),
])

const values = List([
  Map({code: "US", name: "United States"}),

])


export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value1: List(),
      value2: null,
      options: options
    }
  }

  onChange({value, inputValue}) {
    this.setState({value1: value})
  }

  onChange1({value, inputValue}) {
    this.setState({value2: value})
  }

  render() {
    return <div>
    <div>TEST1</div>
    <ComplexInput value={this.state.value1}
      options={this.state.options}
      onChange={this.onChange.bind(this)}
      displayValueTransformer={(value) => value && value.get('name')}
      displayOptionTransformer={(options) => options.get('name')}
      valueToOptionTransformer={(value) => value }
      optionsIsEquals={ (opt1, opt2) => opt1.get('code') == opt2.get('code')}
      filterOptionByInputValue={ (option, inputValue) => option.get('name').toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 } />

    <div>TEST</div>
    <ComplexInput value={this.state.value2}
      options={this.state.options}
      onChange={this.onChange1.bind(this)}
      displayValueTransformer={(value) => value && value.get('name')}
      displayOptionTransformer={(options) => options.get('name')}
      valueToOptionTransformer={(value) => value }
      optionsIsEquals={ (opt1, opt2) => opt1.get('code') == opt2.get('code')}
      filterOptionByInputValue={ (option, inputValue) => option.get('name').toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 } />
  </div>
  }
}

ReactDOM.render(<View />, document.getElementById('react'))