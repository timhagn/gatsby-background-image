// Import React so that you can use JSX in HeadComponents
import React from 'react';
import { oneLine } from 'common-tags';

const generateHtml = str => {
  return {
    __html: oneLine(str),
  };
};

const HeadComponents = [
  <style
    key="main-above"
    data-gbi=""
    dangerouslySetInnerHTML={generateHtml(
      `.gatsby-image-wrapper { content: 'TEST'; }`
    )}
  />,
  <script
    key="gbi-script"
    type="module"
    dangerouslySetInnerHTML={generateHtml(`
      const mainStyleTag = document.body.querySelector('[data-main-bgimage]');
      const aboveTheFoldStyle = document.body.querySelector('[data-gbi]')
      aboveTheFoldStyle.textContent = mainStyleTag.textContent;
    `)}
  />,
];

exports.onRenderBody = ({ setHeadComponents }) => {
  // setHeadComponents(HeadComponents);
  // console.log('HERE in bg image SSR!!!!!');
};
