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
    const { identifier = 'maria-uid', includeGenerator = false } = options || {}

    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV !== 'production') {
        if (identifier == null || !html4Id.test(identifier)) {
            throw new Error('[withUniqueId] identifier must be a HTML4 compatible id string starting with ASCII letter')
        }
    }

    return function(Component) {
        class UniqueId extends React.PureComponent {
            static propTypes = {
                forwardedRef: PropTypes.any,
                uniqueId: PropTypes.string,
            }

            nextIds = {}
            state = {
                uniqueId: registerUniqueId(this.props.uniqueId != null ? this.props.uniqueId : identifier),
                uniqueIdProps: this.props.uniqueId,
            }

            static getDerivedStateFromProps(props, state) {
                if (state.uniqueIdProps === props.uniqueId) {
                    return null
                }

                unregisterUniqueId(state.uniqueId)

                return {
                    uniqueId: registerUniqueId(props.uniqueId != null ? props.uniqueId : identifier),
                    uniqueIdProps: props.uniqueId,
                }
            }

            componentWillUnmount() {
                unregisterUniqueId(this.state.uniqueId)
            }

            lastUniqueId = id => {
                const key = typeof id === 'string' ? id : ''
                const array = this.nextIds[key]

                return (Array.isArray(array) && array[array.length - 1]) || null
            }

            nextUniqueId = id => {
                const key = typeof id === 'string' ? id : ''
                const uniqueId = registerUniqueId(`${this.state.uniqueId}.${key}`)

                if (!Array.isArray(this.nextIds[key])) {
                    this.nextIds[key] = []
                }

                this.nextIds[key].push(uniqueId)
                return uniqueId
            }

            generator = Object.defineProperty(Object.defineProperty({}, 'last', { value: this.lastUniqueId }), 'next', {
                value: this.nextUniqueId,
            })

            uniqueIdGen = () => {
                const keys = Object.keys(this.nextIds)

                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j]

                    for (let i = 0; i < this.nextIds[key].length; i++) {
                        unregisterUniqueId(this.nextIds[key][i])
                    }

                    this.nextIds[key].length = 0
                }

                return this.generator
            }

            render() {
                const { forwardedRef, ...props } = this.props
                const { uniqueId } = this.state

                const uniqueIdGen = includeGenerator ? this.uniqueIdGen : null

                return <Component {...props} ref={forwardedRef} uniqueId={uniqueId} uniqueIdGen={uniqueIdGen} />
            }
        }

        return React.forwardRef((props, ref) => <UniqueId {...props} forwardedRef={ref} />)
    }
}
