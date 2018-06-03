import React from 'react'
import PropTypes from 'prop-types'

export const uniqueIdSet = new Set()

export function clearUniqueIds() {
    uniqueIdSet.clear()
}

export function registerUniqueId(identifier) {
    let num = 1

    while (uniqueIdSet.has(identifier + num)) {
        num++
    }

    uniqueIdSet.add(identifier + num)
    return identifier + num
}

export function unregisterUniqueId(uniqueId) {
    if (uniqueIdSet.has(uniqueId)) {
        uniqueIdSet.delete(uniqueId)
    }
}

const html4Id = /^[A-Za-z]+[\w\-:.]*$/

export function withUniqueId(Component, identifier = 'maria-uid') {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV !== 'production') {
        if (!html4Id.test(identifier)) {
            throw new Error('[withUniqueId] identifier must be a HTML4 compatible id string starting with ASCII letter')
        }
    }

    class UniqueId extends React.PureComponent {
        static propTypes = {
            forwardedRef: PropTypes.func,
        }

        uniqueId = registerUniqueId(identifier)

        componentWillUnmount() {
            unregisterUniqueId(this.uniqueId)
        }

        render() {
            const { forwardedRef, ...props } = this.props

            return <Component {...props} ref={forwardedRef} uniqueId={this.uniqueId} />
        }
    }

    return React.forwardRef((props, ref) => <UniqueId {...props} forwardedRef={ref} />)
}
