import React from 'react'
import PropTypes from 'prop-types'
import noScroll from 'no-scroll'

import { getProp, noop } from '../lib/utils'
import { hidden } from '../lib/styles'

import OverlayProvider from './Overlay'
import { withUniqueId } from './UniqueId'

class ModalOverlay extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        id: PropTypes.string,
        initialModalId: PropTypes.string,
        name: PropTypes.string,
        noName: PropTypes.bool,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        uniqueId: PropTypes.string.isRequired,
    }

    static defaultProps = {
        onClose: noop,
        onOpen: noop,
    }

    modals = this.props.initialModalId ? [this.props.initialModalId] : []
    scrollFreezes = []

    state = {
        currentModalId: getProp(this.props.initialModalId, ''),
    }

    value = {
        closeById: modalId => {
            const index = this.modals.indexOf(modalId)

            if (index !== -1) {
                this.modals.splice(index, 1)
                this.props.onClose(modalId)
                this.setState({
                    currentModalId: this.modals.length ? this.modals[this.modals.length - 1] : '',
                })
                const freezeIndex = this.scrollFreezes.indexOf(modalId)

                if (freezeIndex !== -1) {
                    this.scrollFreezes.splice(freezeIndex, 1)

                    if (this.scrollFreezes.length === 0) {
                        noScroll.off()
                    }
                }
            }
        },
        getIndexById: modalId => this.modals.indexOf(modalId),
        isOpenById: modalId => this.modals.includes(modalId),
        openById: (modalId, freezeScroll) => {
            const index = this.modals.indexOf(modalId)

            if (index === -1) {
                this.modals.push(modalId)
                this.props.onOpen(modalId)

                if (freezeScroll) {
                    if (this.scrollFreezes.length === 0) {
                        noScroll.on()
                    }

                    this.scrollFreezes.push(modalId)
                }
            }

            if (this.state.currentModalId !== modalId) {
                this.setState({ currentModalId: modalId })
            }
        },
    }

    render() {
        const currentModalId = this.state.currentModalId
        const id = getProp(this.props.id, this.props.uniqueId)
        const name = this.props.noName === true ? null : getProp(this.props.name, id)
        /**
         * Change object reference only if there are actual changes.
         */
        if (
            this.value.currentModalId !== currentModalId ||
            this.value.overlayId !== id ||
            this.value.overlayName !== name
        ) {
            this.value = { ...this.value, currentModalId, overlayId: id, overlayName: name }
        }

        return (
            <OverlayProvider value={this.value}>
                <input
                    checked={currentModalId !== ''}
                    id={id}
                    name={name}
                    onChange={this.props.onChange}
                    style={hidden}
                    type="checkbox"
                    value={currentModalId}
                />
                {typeof this.props.children === 'function'
                    ? this.props.children({ ...this.value })
                    : this.props.children}
            </OverlayProvider>
        )
    }
}

export default withUniqueId({ identifier: 'modal-overlay' })(ModalOverlay)
