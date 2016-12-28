# complex_input
React version of complex input.

### types:
```
  value: A | Immutable.List(A) | Immutable.OrderedSet(A)
  options: Immutable.List(B)
  displayValueTransformer: (A | Immutable.List(A) | Immutable.OrderedSet(A)) => String
  displayOptionTransformer: (B) => String
  optionToValueTransformer: (B) => A
  valueToOptionTransformer: (String) => B
  optionsIsEquals: (B, B) => Boolean
  filterOptionByInputValue: (B, String) => Boolean
  option: Immutable.List(B)
  onChange: ({value: (A | Immutable.List(A) | Immutable.OrderedSet(A)), inputValue:String}) => void
``` 

##to build locally for testing
```
npm install
npm run build
```

##to build distribution version
```
npm install
npm run start
```
