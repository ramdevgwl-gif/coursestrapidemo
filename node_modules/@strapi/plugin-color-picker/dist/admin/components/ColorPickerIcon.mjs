import { jsx } from 'react/jsx-runtime';
import { Flex } from '@strapi/design-system';
import { PaintBrush } from '@strapi/icons';
import { styled } from 'styled-components';

const IconBox = styled(Flex)`
  /* Hard code color values */
  /* to stay consistent between themes */
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;
const ColorPickerIcon = ()=>{
    return /*#__PURE__*/ jsx(IconBox, {
        justifyContent: "center",
        alignItems: "center",
        width: 7,
        height: 6,
        hasRadius: true,
        "aria-hidden": true,
        children: /*#__PURE__*/ jsx(PaintBrush, {})
    });
};

export { ColorPickerIcon };
//# sourceMappingURL=ColorPickerIcon.mjs.map
