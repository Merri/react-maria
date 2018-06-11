import React from 'react'
import PropTypes from 'prop-types'

import { getProp } from '../lib/utils'
import { withUniqueId } from './UniqueId'

const Context = React.createContext('overlay')

export const TabsConsumer = Context.Consumer

class Tabs extends React.PureComponent {
    static propTypes = {
        accordion: PropTypes.oneOf(['multiple', 'toggle']),
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        component: PropTypes.any,
        id: PropTypes.string,
        initialPanels: PropTypes.array,
        name: PropTypes.string,
        onChange: PropTypes.func,
        onPanels: PropTypes.func,
        panels: PropTypes.array,
        uniqueId: PropTypes.string.isRequired,
        uniqueIdGen: PropTypes.string.isRequired,
    }

    static defaultProps = { component: 'div', initialPanels: [] }

    labelIds = []
    panelIds = []

    state = {
        id: getProp(this.props.id, this.props.uniqueId),
        name: getProp(this.props.name, this.props.uniqueId),
        panels: getProp(this.props.panels, this.props.initialPanels),
    }

    value = {
        addLabel: labelId => {
            this.labelIds.push(labelId)
        },
        addPanel: panelId => {
            this.panelIds.push(panelId)
        },
        removeLabel: labelId => {
            const index = this.labelIds.indexOf(labelId)
            if (index !== -1) this.labelIds.splice(index, 1)
        },
        removePanel: panelId => {
            const index = this.panelIds.indexOf(panelId)
            if (index !== -1) this.panelIds.splice(index, 1)
        },
    }

    render() {
        const { children, component, uniqueId, ...rest } = this.props

        if (this.value.name !== this.state.name) {
            this.value = { ...this.value, name: this.state.name }
        }

        const props = { ...rest, id: this.state.id }

        return (
            <Context.Provider value={this.value}>
                {typeof children === 'function'
                    ? children({ component, ...props, ...this.value })
                    : React.createElement(component, props, children)}
            </Context.Provider>
        )
    }
}

export default withUniqueId({ identifier: 'maria-tabs', includeGenerator: true })(Tabs)
