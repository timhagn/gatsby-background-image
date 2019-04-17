import '@babel/polyfill'
import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import 'react-testing-library/cleanup-after-each'
import { mockAllIsIntersecting } from './mocks/IntersectionObserver.mock'

import { setup } from './index'
import BackgroundImage from '../'


describe(`<BackgroundImage /> with mock IO`, () => {
  it(`should render visible image`, () => {
    const component = setup()
    expect(component).toMatchSnapshot()
    mockAllIsIntersecting(true)
    expect(component).toMatchSnapshot()
  })
})

describe(`<BackgroundImage /> without IO`, () => {
  const tmpIO = global.IntersectionObserver
  beforeEach(() => {
    delete global.IntersectionObserver
  })
  afterEach(()=> {
    global.IntersectionObserver = tmpIO
  })

  it(`should call onLoadFunction without IO`, () => {
    const onLoadFunctionMock = jest.fn()
    const component = setup(true, true, `test`, true, null, null, true, onLoadFunctionMock)
    expect(component).toMatchSnapshot()
    expect(onLoadFunctionMock).toHaveBeenCalled()
  })
})