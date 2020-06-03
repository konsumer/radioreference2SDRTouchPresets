// Build SDRTouch Presets from radioreference site

const { getFrequencies } = require('../getFrequencies')

module.exports = (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="SDRTouchPresets.xml"')
  getFrequencies(req.query.zip).then(res.send)
}
