import React from 'react'
import PropTypes from 'prop-types'
import { scopeFocus as scope, unscopeFocus as unscope } from 'a11y-focus-scope'

import { withOverlay } from './OverlayContext'

class Overlay extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        component: PropTypes.any,
        getIndexById: PropTypes.func.isRequired,
        id: PropTypes.string,
        isOpenById: PropTypes.func.isRequired,
        noCloseOnBodyClick: PropTypes.bool,
        noCloseOnEscKey: PropTypes.bool,
        noFocusRestore: PropTypes.bool,
        onRequestClose: PropTypes.func,
        role: PropTypes.oneOf(['alert', 'listbox', 'menu', 'modal', 'popover', 'tooltip']),
        scopeFocus: PropTypes.bool,
    }

    static defaultProps = {
        component: 'div',
        role: 'popover',
    }

    componentDidMount() {
        this.prevFocusEl = document.activeElement

        if (this.props.scopeFocus) {
            scope(this.node)
        }

        document.addEventListener('click', this.onDocClick, true)
        document.addEventListener('keydown', this.onDocKeyDown, true)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocClick, true)
        document.removeEventListener('keydown', this.onDocKeyDown, true)

        if (this.props.scopeFocus) {
            unscope(this.node)
        }

        if (!this.props.noFocusRestore && document.activeElement === document.body) {
            this.prevFocusEl.focus()
        }
    }

    handleNode = node => {
        if (this.props.scopeFocus && this.node && node) {
            unscope(this.node)
            scope(node)
        }

        this.node = node
    }

    onDocClick = event => {
        if (
            !this.props.noCloseOnBodyClick &&
            !event.defaultPrevented &&
            this.node &&
            this.node !== event.target &&
            !this.node.contains(event.target) &&
            this.prevFocusEl !== event.target
        ) {
            event.preventDefault()
            event.stopPropagation()
            this.props.onRequestClose(false)
        }
    }

    onDocKeyDown = event => {
        if (!this.props.noCloseOnEscKey && !event.defaultPrevented && event.key === 'Escape') {
            event.preventDefault()
            this.props.onRequestClose(true)
        }
    }

    render() {
        const {
            children,
            component,
            getIndexById,
            isOpenById,
            noCloseOnBodyClick,
            noCloseOnEscKey,
            noFocusRestore,
            onRequestClose,
            scopeFocus,
            ...props
        } = this.props

        if (typeof children === 'function') {
            return children({ ...this.props, ref: this.handleNode })
        }

        return React.createElement(component, { ...props, ref: this.handleNode }, children)
    }
}

export default withOverlay(Overlay)
