/* eslint-env jest */
/* eslint-disable react/prop-types,react/no-multi-comp */
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
    // coverage: should not care about removing things that do not exist
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
    expect(data.props.id).toEqual('maria-uid1')
    expect(typeof data.props.uniqueId).toBe('function')
    // allow setting base identifier via props as well
    tree.update(<Component id="test" />)
    expect(data.props.id).toEqual('test1')
    // should restore back to normal
    tree.update(<Component />)
    expect(data.props.id).toEqual('maria-uid1')
})

test('withUniqueId exposes uniqueId with `next` and `last` for components', () => {
    const UniqComp = props => {
        const uid = props.uniqueId()

        // coverage
        if (uid.last() != null) throw new Error('calling `last` before `next` should return null')
        if (uid.last('a') != null) throw new Error('calling `last` before `next` should return null')

        return (
            <dl id={props.id}>
                {['a', 'b'].map((subId, index) => (
                    <React.Fragment key={index}>
                        <dt id={uid.next()}>{`I am known as "${uid.last()}"`}</dt>
                        <dd>I am here to make semantics right.</dd>
                        {props.useSubId && <dd id={uid.next(subId)}>{uid.last(subId)}</dd>}
                        {props.useSubId && <dd id={uid.next(subId)}>{uid.last(subId)}</dd>}
                    </React.Fragment>
                ))}
                <dd>{props.children}</dd>
            </dl>
        )
    }

    UniqComp.defaultProps = { useSubId: false }

    const Component = withUniqueId()(UniqComp)

    // generator should be available
    const tree = renderer.create(<Component />)
    expect(tree.toJSON()).toMatchSnapshot()
    expect(tree.root.findByProps({ id: 'maria-uid1.1' }).children).toEqual(['I am known as "maria-uid1.1"'])
    expect(tree.root.findByProps({ id: 'maria-uid1.2' }).children).toEqual(['I am known as "maria-uid1.2"'])
    expect(uniqueIdSet.size).toEqual(3)

    // generator should allow extending the generated id with custom string
    tree.update(<Component useSubId />)
    expect(tree.toJSON()).toMatchSnapshot()
    expect(tree.root.findByProps({ id: 'maria-uid1.1' }).children).toEqual(['I am known as "maria-uid1.1"'])
    expect(tree.root.findByProps({ id: 'maria-uid1.a1' }).children).toEqual(['maria-uid1.a1'])
    expect(tree.root.findByProps({ id: 'maria-uid1.a2' }).children).toEqual(['maria-uid1.a2'])
    expect(tree.root.findByProps({ id: 'maria-uid1.2' }).children).toEqual(['I am known as "maria-uid1.2"'])
    expect(tree.root.findByProps({ id: 'maria-uid1.b1' }).children).toEqual(['maria-uid1.b1'])
    expect(tree.root.findByProps({ id: 'maria-uid1.b2' }).children).toEqual(['maria-uid1.b2'])
    expect(uniqueIdSet.size).toEqual(7)

    // make sure we can have two similar kind of components at the same time
    tree.update(
        <Component useSubId>
            <Component id="test" useSubId />
        </Component>,
    )
    expect(tree.toJSON()).toMatchSnapshot()
    expect(tree.root.findByProps({ id: 'test1.1' }).children).toEqual(['I am known as "test1.1"'])
    expect(tree.root.findByProps({ id: 'test1.a1' }).children).toEqual(['test1.a1'])
    expect(tree.root.findByProps({ id: 'test1.a2' }).children).toEqual(['test1.a2'])
    expect(tree.root.findByProps({ id: 'test1.2' }).children).toEqual(['I am known as "test1.2"'])
    expect(tree.root.findByProps({ id: 'test1.b1' }).children).toEqual(['test1.b1'])
    expect(tree.root.findByProps({ id: 'test1.b2' }).children).toEqual(['test1.b2'])
    expect(uniqueIdSet.size).toEqual(14)
})

test('withUniqueId exposes uniqueId with `make` for components', () => {
    const UniqComp = props => {
        const uid = props.uniqueId()

        // coverage
        if (uid.make(null) != null) throw new Error('null to `make` should return null')
        if (uid.make('abc') != null) throw new Error('string to `make` should return null')

        const array = uid.make([`yksi${props.coverage}`, `kaksi${props.coverage}`])
        const obj = uid.make({ one: `yksi${props.coverage}`, two: `kaksi${props.coverage}` })

        return (
            <ul id={props.id}>
                {array.map(id => (
                    <li id={id} key={id}>
                        Make from array: {id}
                    </li>
                ))}
                <li id={obj.one}>Make from object ONE: {obj.one}</li>
                <li id={obj.two}>Make from object TWO: {obj.two}</li>
            </ul>
        )
    }

    UniqComp.defaultProps = { coverage: '' }

    const Component = withUniqueId()(UniqComp)

    const tree = renderer.create(<Component />)
    expect(tree.toJSON()).toMatchSnapshot()
    expect(tree.root.findByProps({ id: 'maria-uid1.yksi1' }).children).toEqual([
        'Make from array: ',
        'maria-uid1.yksi1',
    ])
    expect(tree.root.findByProps({ id: 'maria-uid1.kaksi1' }).children).toEqual([
        'Make from array: ',
        'maria-uid1.kaksi1',
    ])
    expect(tree.root.findByProps({ id: 'maria-uid1.yksi2' }).children).toEqual([
        'Make from object ONE: ',
        'maria-uid1.yksi2',
    ])
    expect(tree.root.findByProps({ id: 'maria-uid1.kaksi2' }).children).toEqual([
        'Make from object TWO: ',
        'maria-uid1.kaksi2',
    ])
    expect(uniqueIdSet.size).toEqual(5)

    // coverage: test update with nothing
    tree.update(<Component />)
    expect(uniqueIdSet.size).toEqual(5)
    // coverage: remove unused render-time nextIds arrays
    tree.update(<Component coverage="moo" />)
    expect(uniqueIdSet.size).toEqual(5)
    tree.update(<Component coverage="moo" forceReRender />)
    expect(uniqueIdSet.size).toEqual(5)
    // test componentWillUnmount
    tree.update(<div />)
    expect(uniqueIdSet.size).toEqual(0)
})
