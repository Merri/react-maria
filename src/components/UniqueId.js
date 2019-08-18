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

export function withUniqueId(options) {
    const { identifier = 'maria-uid' } = options || {}

    if (identifier == null || !html4Id.test(identifier)) {
        throw new Error('[withUniqueId] identifier must be a HTML4 compatible id string starting with ASCII letter')
    }

    return function(Component) {
        class UniqueId extends React.PureComponent {
            static propTypes = {
                forwardedRef: PropTypes.any,
                id: PropTypes.string,
            }

            currentId = this.props.id
            id = registerUniqueId(this.props.id != null ? this.props.id : identifier)
            // storage for ids generated in components during render using next() or make()
            renderIds = {}

            componentWillUnmount() {
                this.removeRenderGeneratedIds()
                unregisterUniqueId(this.id)
            }

            lastUid = id => {
                const key = typeof id === 'string' ? id : ''
                const array = this.renderIds[key]

                return (Array.isArray(array) && array[array.length - 1]) || null
            }

            makeUids = ids => {
                if (Array.isArray(ids)) return ids.map(this.nextUid)
                if (ids == null || typeof ids !== 'object') return null

                return Object.keys(ids).reduce((output, key) => {
                    output[key] = this.nextUid(ids[key])
                    return output
                }, {})
            }

            nextUid = id => {
                const key = typeof id === 'string' ? id : ''
                if (!Array.isArray(this.renderIds[key])) this.renderIds[key] = []
                const uniqueId = registerUniqueId(`${this.id}.${key}`)
                this.renderIds[key].push(uniqueId)
                return uniqueId
            }

            tools = [['last', this.lastUid], ['make', this.makeUids], ['next', this.nextUid]].reduce(
                (output, pair) => Object.defineProperty(output, pair[0], { value: pair[1] }),
                {},
            )

            uniqueId = () => {
                this.removeRenderGeneratedIds()
                return this.tools
            }

            removeRenderGeneratedIds = () => {
                const keys = Object.keys(this.renderIds)

                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j]

                    // perf: only delete if not being used in two consecutive renders
                    if (this.renderIds[key].length === 0) {
                        delete this.renderIds[key]
                    } else {
                        while (this.renderIds[key].length) {
                            unregisterUniqueId(this.renderIds[key].pop())
                        }
                    }
                }
            }

            render() {
                const { forwardedRef, id, ...props } = this.props

                if (id !== this.currentId) {
                    unregisterUniqueId(this.id)
                    this.currentId = id
                    this.id = registerUniqueId(id != null ? id : identifier)
                }

                return <Component {...props} ref={forwardedRef} id={this.id} uniqueId={this.uniqueId} />
            }
        }
        // eslint-disable-next-line react/display-name,react/no-multi-comp
        return React.forwardRef((props, ref) => <UniqueId {...props} forwardedRef={ref} />)
    }
}
