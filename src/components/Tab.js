import React from 'react'
import PropTypes from 'prop-types'

export default class Tab extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        component: PropTypes.any,
    }

    static defaultProps = { component: 'li' }

    render() {
        const { children, component, ...rest } = this.props

        const props = { ...rest, role: 'tab' }

        return React.createElement(component, props, children)
    }
}
