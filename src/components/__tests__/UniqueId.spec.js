/* eslint-env jest */
/* eslint-disable react/prop-types */
import React from 'react'
import renderer from 'react-test-renderer'
import { clearUniqueIds, registerUniqueId, uniqueIdSet, unregisterUniqueId, withUniqueId } from '../UniqueId'

function noop() {}

afterEach(() => {
    clearUniqueIds()
})

test('registerUniqueId adds new items to uniqueIdSet', () => {
    expect(registerUniqueId('test')).toEqual('test1')
    expect(registerUniqueId('test')).toEqual('test2')
    expect(uniqueIdSet.size).toEqual(2)
})

test('clearUniqueIds should clear uniqueIdSet', () => {
    registerUniqueId('test')
    expect(uniqueIdSet.size).toEqual(1)
    clearUniqueIds()
    expect(uniqueIdSet.size).toEqual(0)
})

test('unregisterUniqueId removes items from uniqueIdSet', () => {
    expect(registerUniqueId('test')).toEqual('test1')
    unregisterUniqueId('test1')
    expect(registerUniqueId('test')).toEqual('test1')
    unregisterUniqueId('test1')
    expect(uniqueIdSet.size).toEqual(0)
})

test('withUniqueId throws when identifier is not HTML4 specced id string', () => {
    global.spyOn(console, 'error')
    expect(() => withUniqueId({ identifier: '1' })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: 1 })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: null })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: {} })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: noop })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: 'åäö' })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: '$€' })).toThrowErrorMatchingSnapshot()
    expect(() => withUniqueId({ identifier: '[(' })).toThrowErrorMatchingSnapshot()
})

test('withUniqueId acts as a HoC for components', () => {
    const data = {}

    const Component = withUniqueId()(props => {
        // yeah, ugly, but works
        data.props = props
        return <div />
    })

    const tree = renderer.create(<Component />)
    expect(data.props.uniqueId).toEqual('maria-uid1')
    expect(data.props.uniqueIdGen).toBeNull()
    // allow setting base identifier via props as well
    tree.update(<Component uniqueId="test" />)
    expect(data.props.uniqueId).toEqual('test1')
    // should restore back to normal
    tree.update(<Component />)
    expect(data.props.uniqueId).toEqual('maria-uid1')
})

test('withUniqueId exposes ID generator for components when requested', () => {
    const UniqComp = props => {
        const uid = props.uniqueIdGen()

        return (
            <ul>
                {['a', 'b'].map((subId, index) => (
                    <li key={index} id={uid.next(props.useSubId && subId)}>
                        {`I am known as "${uid.last(props.useSubId && subId)}"`}
                    </li>
                ))}
            </ul>
        )
    }

    const Component = withUniqueId({ includeGenerator: true })(UniqComp)
    const Component2 = withUniqueId({ includeGenerator: false })(UniqComp)

    // generator should be available
    const tree = renderer.create(<Component />)
    expect(tree.root.findByProps({ id: 'maria-uid1.1' }).children).toEqual(['I am known as "maria-uid1.1"'])
    expect(tree.root.findByProps({ id: 'maria-uid1.2' }).children).toEqual(['I am known as "maria-uid1.2"'])
    expect(uniqueIdSet.size).toEqual(3)

    // generator should allow extending the generated id with custom string
    tree.update(<Component useSubId />)
    expect(tree.root.findByProps({ id: 'maria-uid1.a1' }).children).toEqual(['I am known as "maria-uid1.a1"'])
    expect(tree.root.findByProps({ id: 'maria-uid1.b1' }).children).toEqual(['I am known as "maria-uid1.b1"'])
    expect(uniqueIdSet.size).toEqual(3)

    // generator should also become available via a boolean flag
    // NOTE: componentWillUnmount of Component will be called after Component2's render, thus "maria-uid2"
    tree.update(<Component2 uniqueIdGen />)
    expect(tree.root.findByProps({ id: 'maria-uid2.1' }).children).toEqual(['I am known as "maria-uid2.1"'])
    expect(tree.root.findByProps({ id: 'maria-uid2.2' }).children).toEqual(['I am known as "maria-uid2.2"'])
    expect(uniqueIdSet.size).toEqual(3)
})
