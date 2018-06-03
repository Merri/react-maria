import React from 'react'
import PropTypes from 'prop-types'
import noScroll from 'no-scroll'

import { getProp } from '../lib/utils'
import { hidden } from '../lib/styles'

import OverlayContext from './OverlayContext'
import { withUniqueId } from './UniqueId'

class OverlayProvider extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.string,
        initialOverlayId: PropTypes.string,
        name: PropTypes.string,
        noName: PropTypes.bool,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        uniqueId: PropTypes.string.isRequired,
    }

    overlays = this.props.initialOverlayId ? [this.props.initialOverlayId] : []
    scrollFreezes = []

    state = {
        currentOverlayId: getProp(this.props.initialOverlayId, null),
    }

    value = {
        closeById: overlayId => {
            const index = this.overlays.indexOf(overlayId)

            if (index !== -1) {
                this.overlays.splice(index, 1)
                this.onClose(overlayId)
                this.setState({
                    currentOverlayId: this.overlays.length ? this.overlays[this.overlays.length - 1] : null,
                })
                const freezeIndex = this.scrollFreezes.indexOf(overlayId)

                if (freezeIndex !== -1) {
                    this.scrollFreezes.splice(freezeIndex, 1)

                    if (this.scrollFreezes.length === 0) {
                        noScroll.off()
                    }
                }
            }
        },
        getIndexById: overlayId => this.overlays.indexOf(overlayId),
        isOpenById: overlayId => this.overlays.includes(overlayId),
        openById: (overlayId, freezeScroll) => {
            const index = this.overlays.indexOf(overlayId)

            if (index === -1) {
                this.overlays.push(overlayId)
                this.onOpen(overlayId)

                if (freezeScroll) {
                    if (this.scrollFreezes.length === 0) {
                        noScroll.on()
                    }

                    this.scrollFreezes.push(overlayId)
                }
            }

            if (this.state.currentOverlayId !== overlayId) {
                this.setState({ currentOverlayId: overlayId })
            }
        },
    }

    render() {
        const currentOverlayId = this.state.currentOverlayId
        const id = getProp(this.props.id, this.props.uniqueId)
        const name = this.props.noName === true ? null : getProp(this.props.name, id)
        /**
         * Change object reference only if there are actual changes.
         */
        if (this.value.currentOverlayId !== currentOverlayId || this.value.id !== id || this.value.name !== name) {
            this.value = { ...this.value, currentOverlayId, id, name }
        }

        return (
            <OverlayContext value={this.value}>
                <input
                    checked={currentOverlayId != null}
                    id={id}
                    name={name}
                    onChange={this.props.onChange}
                    style={hidden}
                    type="checkbox"
                    value={currentOverlayId}
                />
                {typeof this.props.children === 'function'
                    ? this.props.children({ ...this.value })
                    : this.props.children}
            </OverlayContext>
        )
    }
}

export default withUniqueId(OverlayProvider, 'overlay-provider')
