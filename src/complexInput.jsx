import React from 'react'
import {Map, List, OrderedSet} from 'immutable'

import styles from './complexInput.sass'

const ChevronIcon = props => <svg width="9px" height="6px" viewBox="0 0 9 6" {...props}>
  <path d="M0.445084546,1.41638666 C-0.331029777,0.63413791 -0.0670778039,0 1.04155292,0 L7.95179508,0 C9.05732979,0 9.32757051,0.630919933 8.54826345,1.41638666 L4.496674,5.5 L0.445084546,1.41638666 Z" />
</svg>

const CloseIcon = props => <svg width="13px" height="13px" viewBox="0 0 13 13" {...props}>
  <path className="icon-primaryFill" d="M4.32903056,6.4503509 L0.446050253,10.3333312 C-0.149486708,10.9288682 -0.145843179,11.8749721 0.439943259,12.4607585 C1.02981369,13.050629 1.97821136,13.0438108 2.5673706,12.4546515 L6.4503509,8.57167124 L10.3333312,12.4546515 C10.9288682,13.0501885 11.8749721,13.046545 12.4607585,12.4607585 C13.050629,11.8708881 13.0438108,10.9224904 12.4546515,10.3333312 L8.57167124,6.4503509 L12.4546515,2.5673706 C13.0501885,1.97183364 13.046545,1.0257297 12.4607585,0.439943259 C11.8708881,-0.149927174 10.9224904,-0.143108984 10.3333312,0.446050253 L6.4503509,4.32903056 L2.5673706,0.446050253 C1.97183364,-0.149486708 1.0257297,-0.145843179 0.439943259,0.439943259 C-0.149927174,1.02981369 -0.143108984,1.97821136 0.446050253,2.5673706 L4.32903056,6.4503509 L4.32903056,6.4503509 Z" />
</svg>

export default class ComplexInput extends React.Component {
  constructor(props) {
    super(props)

    var value = this.props.value
    if(List.isList(this.props.value)) {
      value = this.props.value.toOrderedSet();
    }

    this.state = {
      isFocused: false,
      focusedOptionIndex: 0,
      focusedTagIndex: null,
      value,
      valueAsOptions: OrderedSet.isOrderedSet(value)?value.map(v => this.valueToOptionTransformer(v)):null,
      inputValue: this.props.inputValue || (OrderedSet.isOrderedSet(value)?"":this.props.displayValueTransformer(value)) || "",
    }
  }

  componentWillReceiveProps(nextProps) {
    var value = nextProps.value
    if(List.isList(nextProps.value)) {
      value = nextProps.value.toOrderedSet();
    }

    const test = (OrderedSet.isOrderedSet(value)?"":this.props.displayValueTransformer(value))

    this.setState({
      value,
      valueAsOptions: OrderedSet.isOrderedSet(value)?value.map(v => this.valueToOptionTransformer(v, nextProps)):null,
      // inputValue: this.props.inputValue || (OrderedSet.isOrderedSet(value)?"":this.props.displayValueTransformer(value)) || "",
    })
  }

  displayValueTransformer(value, props) {
    if((props || this.props).displayValueTransformer) return (props || this.props).displayValueTransformer(value)
    else return value
  }
  displayOptionTransformer(option, props) {
    if((props || this.props).displayOptionTransformer) return (props || this.props).displayOptionTransformer(option)
    else return option
  }
  optionToValueTransformer(option, props) {
    if((props || this.props).optionToValueTransformer) return (props || this.props).optionToValueTransformer(option)
    else return option
  }
  valueToOptionTransformer(value, props) {
    if((props || this.props).valueToOptionTransformer) return (props || this.props).valueToOptionTransformer(value)
    else return value
  }
  optionsIsEquals(option1, option2, props) {
    if((props || this.props).optionsIsEquals) return (props || this.props).optionsIsEquals(option1, option2)
    else return option1 == option2
  }
  filterOptionByInputValue(option, inputValue, props) {
    if((props || this.props).filterOptionByInputValue) return (props || this.props).filterOptionByInputValue(option, inputValue)
    else return option.indexOf(inputValue) >= 0
  }

  onChange(value, inputValue) {
    this.props.onChange && this.props.onChange({value, inputValue})
  }
  onChangeInput(e) {
    const inputValue = e.target.value
    this.setState({inputValue, focusedOptionIndex: 0})
    this.onChange(this.state.value, inputValue)
  }

  deleteTag(tag, index) {
    const value = this.state.value.delete(tag)
    const valueAsOptions = OrderedSet.isOrderedSet(value)?value.map(v => this.valueToOptionTransformer(v)):null
    this.setState({value, valueAsOptions})
    this.onChange(value, this.state.inputValue)
  }

  filteredOptions(_valueAsOptions) {
    const valueAsOptions = _valueAsOptions || this.state.valueAsOptions
    return this.props.options.filter(option => {
      if(OrderedSet.isOrderedSet(valueAsOptions)) return !(valueAsOptions).find( opt => this.optionsIsEquals(opt, option))
      else return true
    })
    .filter(option => {
      if(!OrderedSet.isOrderedSet(valueAsOptions)) {
        if(this.displayValueTransformer(this.state.value) == this.state.inputValue) return true
        else return this.state.inputValue == null || this.filterOptionByInputValue(option, this.state.inputValue)
      }
      else return this.state.inputValue == null || this.filterOptionByInputValue(option, this.state.inputValue)
    })
  }

  onClickOption(index) {
    const option = this.filteredOptions().get(index)
    var value = null;
    var inputValue = "";
    if(OrderedSet.isOrderedSet(this.state.value)) {
      value = this.state.value.add(this.optionToValueTransformer(option))  
    } else {
      value = this.optionToValueTransformer(option)
      inputValue = this.props.displayValueTransformer(this.optionToValueTransformer(option)) || ""
      this.refs.input.blur()
    }
    const valueAsOptions = OrderedSet.isOrderedSet(value)?value.map(v => this.valueToOptionTransformer(v)):null
    
    const count = this.filteredOptions(valueAsOptions).count()
    var focusedOptionIndex = this.state.focusedOptionIndex
    if(focusedOptionIndex >= count && focusedOptionIndex > 0) focusedOptionIndex -= 1

    this.setState({value, valueAsOptions, focusedOptionIndex, inputValue})
    this.onChange(value, null)
  }

  onFocus() { this.setState({isFocused: true, focusedOptionIndex: 0}) }
  onBlur() {
    var inputValue = this.state.inputValue
    var value = null

    if(OrderedSet.isOrderedSet(this.state.value)) {
      value = this.state.value
    } else {
      value = (inputValue == null || inputValue.length == 0)?null:this.state.value
    }
    this.setState({isFocused: false, focusedOptionIndex: 0, value, inputValue})
    this.onChange(value, inputValue)
  }
  onMouseOver(index) { this.setState({focusedOptionIndex: index}) }
  onKeyPress(e) {
    if(e.key == 'Enter') {
      this.onClickOption(this.state.focusedOptionIndex)
    }
  }

  onKeyDown(e) {
    if(e.keyCode == 40) {
      const newIndex = (this.state.focusedOptionIndex + 1) % this.filteredOptions().count() 
      const el = this.refs[`option${newIndex}`]
      if(el == null) return;
      this.setState({focusedOptionIndex: newIndex})

      if( el.offsetTop < el.offsetParent.scrollTop || (el.offsetTop + el.offsetHeight) > (el.offsetParent.scrollTop + el.offsetParent.offsetHeight)) {
        const diff = (el.offsetTop + el.offsetHeight) - el.offsetParent.offsetHeight
        el.offsetParent.scrollTop = diff
      }
    } else if(e.keyCode == 38) {
      const newIndex = (this.state.focusedOptionIndex + this.filteredOptions().count() - 1) % this.filteredOptions().count()
      const el = this.refs[`option${newIndex}`]
      if(el == null) return;
      this.setState({focusedOptionIndex: newIndex})

      if( el.offsetTop < el.offsetParent.scrollTop || (el.offsetTop + el.offsetHeight) > (el.offsetParent.scrollTop + el.offsetParent.offsetHeight)) {
        const diff = (el.offsetTop + el.offsetHeight) - el.offsetParent.offsetHeight
        el.offsetParent.scrollTop = el.offsetTop
      }
    } else if(e.keyCode == 8) {
      if(e.target.selectionStart == e.target.selectionEnd && e.target.selectionStart == 0 && OrderedSet.isOrderedSet(this.state.value)) {
        var value = null
        
        if(this.state.focusedTagIndex == null) {
          value = this.state.value.delete(this.state.value.last())
        } else {
          value = this.state.value.delete(this.state.value.valueSeq().get(this.state.focusedTagIndex))
        }

        const newFocusedTagIndex = Math.min((this.state.focusedTagIndex || value.count() - 1), value.count() - 1)

        const valueAsOptions = OrderedSet.isOrderedSet(value)?value.map(v => this.valueToOptionTransformer(v)):null
        this.setState({value, valueAsOptions, focusedTagIndex: newFocusedTagIndex })
        this.onChange(value, this.state.inputValue)
      }
    } else if(e.keyCode == 37 && e.target.selectionStart == e.target.selectionEnd && e.target.selectionStart == 0) {
      this.setState({focusedTagIndex: this.state.focusedTagIndex==null?this.state.value.count()-1:Math.max(0, this.state.focusedTagIndex - 1)})
    } else if(e.keyCode == 39 && e.target.selectionStart == e.target.selectionEnd && e.target.selectionStart == 0) {
      if(this.state.focusedTagIndex != null) {
        const newFocusedTagIndex = (this.state.focusedTagIndex + 1)
        if(newFocusedTagIndex >= this.state.value.count()) this.setState({focusedTagIndex: null})
        else this.setState({focusedTagIndex: newFocusedTagIndex})
        e.preventDefault()
      }
    } else {
      this.setState({focusedTagIndex: null})
    }
  }

  render() {
    const options = this.filteredOptions();
    return <label className={styles.container}>
      <div className={styles.tags}>
        {OrderedSet.isOrderedSet(this.state.value) && this.state.value.valueSeq().map( (tag, index) => <div className={[styles.tag, (this.state.focusedTagIndex==index)?styles.selectedTag:null].join(" ")} key={index}>
          <div className={styles.tagText}>{this.displayValueTransformer(tag)}</div>
          <CloseIcon className={styles.tagCloseIcon} onClick={this.deleteTag.bind(this, tag, index)} />
        </div>)}
        <input className={styles.input}
          ref="input"
          onChange={this.onChangeInput.bind(this)}
          value={this.state.inputValue}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
          placeholder={this.props.placeholder}
          />
      </div>
      <ChevronIcon />
      {this.state.isFocused && <div className={styles.dropdown}>
        {options && options.map( (option, index) =>
          <div key={index}
            ref={`option${index}`}
            className={[styles.dropdownOption, (this.state.focusedOptionIndex == index)?styles.dropdownOptionSelected:null].join(" ")}
            onMouseOver={this.onMouseOver.bind(this, index)}
            onMouseDown={this.onClickOption.bind(this, index)}>{this.displayOptionTransformer(option)}</div>
        )}
      </div>}
    </label>
  }
}

ComplexInput.propTypes = {
  value: React.PropTypes.oneOfType([React.PropTypes.instanceOf(Map), React.PropTypes.string, React.PropTypes.instanceOf(List), React.PropTypes.instanceOf(OrderedSet)]),
  displayValueTransformer: React.PropTypes.func,
  displayOptionTransformer: React.PropTypes.func,
  optionToValueTransformer: React.PropTypes.func,
  valueToOptionTransformer: React.PropTypes.func,
  optionsIsEquals: React.PropTypes.func,
  filterOptionByInputValue: React.PropTypes.func,
  option: React.PropTypes.func,
  onChange: React.PropTypes.func
}