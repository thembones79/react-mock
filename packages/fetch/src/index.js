// @flow

import { Component } from 'react';
import fetchMock from 'fetch-mock';

import type { Props } from './index.js.flow';

export class FetchMock extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.mock();
  }

  render() {
    return this.props.children;
  }

  componentWillUnmount() {
    // Make sure we don't clear a mock from a newer instance (since React 16
    // B.constructor is called before A.componentWillUnmount)
    if (fetchMock.__fetchMockInst === this) {
      this.unmock();
    }
  }

  mock() {
    // Clear mocks from a previous FetchMock instance
    // NOTE: The last rendered FetchProxy instance will override mocks from
    // the previous ones
    this.unmock();

    const { matcher, response, options, config } = this.props;

    if (config) {
      Object.keys(config).forEach(key => {
        fetchMock.config[key] = config[key];
      });
    }

    fetchMock.mock(matcher, response, options);

    fetchMock.__fetchMockInst = this;
  }

  unmock() {
    if (typeof fetchMock.restore === 'function') {
      fetchMock.restore();
      delete fetchMock.__fetchMockInst;
    }
  }
}