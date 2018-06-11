import React from 'react'
import PropTypes from 'prop-types'

export default class TabList extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        component: PropTypes.any,
    }

    static defaultProps = { component: 'ul' }

    render() {
        const { children, component, ...rest } = this.props

        const props = { ...rest, role: 'tablist' }

        return React.createElement(component, props, children)
    }
}
