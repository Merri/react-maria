import React from 'react'
import PropTypes from 'prop-types'

import { TabsConsumer } from './Tabs'

export class TabPanel extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        component: PropTypes.any,
        id: PropTypes.string.isRequired,
        tab: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        props.tab.addPanel(props.id)
    }

    componentWillUnmount() {
        this.props.tab.removePanel(this.props.id)
    }

    render() {
        const { children, component, tab, ...rest } = this.props

        const props = { ...rest, role: 'tabpanel' }

        return React.createElement(component, props, children)
    }
}

/* eslint-disable react/no-multi-comp */
export default function TabPanelContainer(props) {
    return (
        <TabsConsumer>
            {({ uniqueId, ...tab }) => <TabPanel {...props} id={uniqueId().next('panel')} tab={tab} />}
        </TabsConsumer>
    )
}

TabPanelContainer.defaultProps = { component: 'div' }
TabPanelContainer.propTypes = { component: PropTypes.any }
