// Import React so that you can use JSX in HeadComponents
import React from 'react'
import { oneLine } from 'common-tags'

const generateHtml = str => {
  return {
    __html: oneLine(str),
  }
}

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
      console.log("head me!", mainStyleTag);
      const aboveTheFoldStyle = document.querySelector('[data-gbi]');
      // aboveTheFoldStyle.textContent = mainStyleTag.textContent;
    `)}
  />,
]

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents(HeadComponents)
  console.log('HERE in SSR gbitest!!!!')
}
