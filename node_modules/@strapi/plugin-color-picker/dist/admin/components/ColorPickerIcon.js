'use strict';

var jsxRuntime = require('react/jsx-runtime');
var designSystem = require('@strapi/design-system');
var icons = require('@strapi/icons');
var styledComponents = require('styled-components');

const IconBox = styledComponents.styled(designSystem.Flex)`
  /* Hard code color values */
  /* to stay consistent between themes */
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;
const ColorPickerIcon = ()=>{
    return /*#__PURE__*/ jsxRuntime.jsx(IconBox, {
        justifyContent: "center",
        alignItems: "center",
        width: 7,
        height: 6,
        hasRadius: true,
        "aria-hidden": true,
        children: /*#__PURE__*/ jsxRuntime.jsx(icons.PaintBrush, {})
    });
};

exports.ColorPickerIcon = ColorPickerIcon;
//# sourceMappingURL=ColorPickerIcon.js.map
