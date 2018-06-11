import React from 'react'
import PropTypes from 'prop-types'

import { getProp } from '../lib/utils'

import { TabsConsumer } from './Tabs'

export class TabLabel extends React.PureComponent {
    static propTypes = {
        checked: PropTypes.bool,
        children: PropTypes.node,
        component: PropTypes.any,
        id: PropTypes.string.isRequired,
        tab: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        props.tab.addLabel(props.id)
    }

    componentWillUnmount() {
        this.props.tab.removeLabel(this.props.id)
    }

    render() {
        const { checked, children, component, id, tab, ...rest } = this.props

        const props = { ...rest, htmlFor: id }

        return (
            <React.Fragment>
                <input checked={getProp(checked, tab.isChecked(id))} id={id} type="radio" />
                {React.createElement(component, props, children)}
            </React.Fragment>
        )
    }
}

/* eslint-disable react/no-multi-comp */
export default function TabLabelContainer(props) {
    return (
        <TabsConsumer>
            {({ uniqueIdGen, ...tab }) => <TabLabel {...props} id={uniqueIdGen().next('label')} tab={tab} />}
        </TabsConsumer>
    )
}

TabLabelContainer.defaultProps = { component: 'label' }
TabLabelContainer.propTypes = { component: PropTypes.any }
