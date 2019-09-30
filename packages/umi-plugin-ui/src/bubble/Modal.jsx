import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { getScrollBarSize } from './Dragger/utils';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
  }
`;

const fadeOutDown = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(50px);
  }
`;

const IframeWrapper = styled('div')`
  position: absolute;
  z-index: 1001;
  bottom: 72px;
  right: 0;
  box-shadow: 0 4px 8px 0 rgba(13, 26, 38, 0.2);
  background: #23232d;
  width: 68vw;
  height: 80vh;
  animation: ${({ visible }) => (visible ? fadeInUp : fadeOutDown)} 400ms ease;
  & > * {
    animation: ${({ visible }) => (visible ? fadeInUp : fadeOutDown)} 400ms ease;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
`;

class Modal extends React.Component {
  switchScrollingEffect = close => {
    const bodyIsOverflowing =
      document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
      window.innerWidth > document.body.offsetWidth;
    if (!bodyIsOverflowing) {
      return;
    }
    if (close) {
      document.body.style.position = '';
      document.body.style.width = '';
      return;
    }
    const scrollBarSize = getScrollBarSize();
    if (scrollBarSize) {
      document.body.style.position = 'relative';
      document.body.style.width = `calc(100% - ${scrollBarSize}px)`;
    }
  };

  addScrollingEffect = () => {
    const node = ReactDOM.findDOMNode(this);
    this.switchScrollingEffect();
    document.body.style['overflow-y'] = 'hidden';
    node.style.display = 'block';
    setTimeout(() => {
      node.style.opacity = '1';
    }, 150);
  };

  removeScrollingEffect = () => {
    const node = ReactDOM.findDOMNode(this);
    document.body.style['overflow-y'] = '';
    this.switchScrollingEffect(true);
    node.style.opacity = '0';
    setTimeout(() => {
      node.style.display = 'none';
    }, 150);
  };

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.addScrollingEffect();
      } else {
        this.removeScrollingEffect();
      }
    }
  }

  render() {
    const { children, visible } = this.props;
    return <IframeWrapper visible={visible}>{children}</IframeWrapper>;
  }
}

export default Modal;
