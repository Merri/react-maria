import React from 'react'
import PropTypes from 'prop-types'

import { withUniqueId } from './UniqueId'

const Context = React.createContext('overlay')

export function withOverlay(options) {
    return function(Component) {
        class OverlayConsumer extends React.PureComponent {
            static propTypes = {
                closeById: PropTypes.func.isRequired,
                forwardedRef: PropTypes.func,
                freezeScroll: PropTypes.bool,
                id: PropTypes.string,
                onRequestClose: PropTypes.func,
                openById: PropTypes.func.isRequired,
                overlayId: PropTypes.string.isRequired,
                overlayName: PropTypes.string.isRequired,
            }

            static defaultProps = {
                freezeScroll: false,
            }

            componentDidMount() {
                this.props.openById(this.props.id, this.props.freezeScroll)
            }

            componentDidUpdate(prevProps, prevState) {
                const { freezeScroll, id } = this.props
                if (prevProps.id !== id || prevProps.freezeScroll !== freezeScroll) {
                    this.props.closeById(prevState.id, prevState.freezeScroll)
                    this.props.openById(id, freezeScroll)
                }
            }

            componentWillUnmount() {
                this.props.closeById(this.props.id, this.props.freezeScroll)
            }

            handleRequestClose = usingEscapeKey => {
                if (this.props.onRequestClose) {
                    this.props.onRequestClose(usingEscapeKey)
                }
            }

            render() {
                const { closeById, forwardedRef, freezeScroll, id, openById, ...props } = this.props

                return <Component {...props} id={id} onRequestClose={this.handleRequestClose} ref={forwardedRef} />
            }
        }

        return withUniqueId(options || {})(
            // eslint-disable-next-line react/display-name,react/no-multi-comp
            React.forwardRef((props, ref) => (
                <Context.Consumer>
                    {overlayProps => <OverlayConsumer {...props} {...overlayProps} forwardedRef={ref} />}
                </Context.Consumer>
            )),
        )
    }
}

export default Context.Provider
