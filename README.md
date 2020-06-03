# radioreference2SDRTouchPresets

This will let you make [SDRTouch](https://sdrtouch.com/) presets for a specific area, based on data from the [radioreference](https://www.radioreference.com/) site.

It is deployed [here](https://sdrtouch.dkonsumer.now.sh)

You can also use it as a library, if you do `npm i radioreference2SDRTouchPresets`:

```js
const { getFrequencies } = require('radioreference2SDRTouchPresets')

getFrequencies(process.argv[2]).then(console.log)
```

and you can use it as a cli:

```
npx radioreference2SDRTouchPresets 97239 > SDRTouchPresets.xml
```