import React from 'react'
import PropTypes from 'prop-types'

import { getProp } from '../lib/utils'
import { withUniqueId } from './UniqueId'

const OverlayContext = React.createContext('overlay')

export function withOverlay(Component, identifier = 'overlay') {
    class OverlayConsumer extends React.PureComponent {
        static propTypes = {
            closeById: PropTypes.func.isRequired,
            forwardedRef: PropTypes.func,
            freezeScroll: PropTypes.bool,
            id: PropTypes.string,
            onRequestClose: PropTypes.func,
            openById: PropTypes.func.isRequired,
            uniqueId: PropTypes.string.isRequired,
        }

        static defaultProps = {
            freezeScroll: false,
        }

        static getDerivedStateFromProps(props, state) {
            const id = getProp(props.id, props.uniqueId)

            if (!state || state.id !== id || props.freezeScroll !== state.freezeScroll) {
                return { freezeScroll: props.freezeScroll, id }
            }

            return null
        }

        componentDidMount() {
            this.props.openById(this.state.id, this.state.freezeScroll)
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.state !== prevState) {
                this.props.closeById(prevState.id, prevState.freezeScroll)
                this.props.openById(this.state.id, this.state.freezeScroll)
            }
        }

        componentWillUnmount() {
            this.props.closeById(this.state.id, this.state.freezeScroll)
        }

        handleRequestClose = usingEscapeKey => {
            this.props.closeById(this.state.id, this.state.freezeScroll)

            if (this.props.onRequestClose) {
                this.props.onRequestClose(usingEscapeKey)
            }
        }

        render() {
            const { closeById, forwardedRef, freezeScroll, id, openById, uniqueId, ...props } = this.props

            return (
                <Component {...props} id={this.state.id} onRequestClose={this.handleRequestClose} ref={forwardedRef} />
            )
        }
    }

    return withUniqueId(
        React.forwardRef((props, ref) => {
            return (
                <OverlayContext.Consumer>
                    {overlayProps => <OverlayConsumer {...props} {...overlayProps} forwardedRef={ref} />}
                </OverlayContext.Consumer>
            )
        }),
        identifier,
    )
}

export default OverlayContext
