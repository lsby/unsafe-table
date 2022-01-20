import 'mocha'
import { 表 } from '../src/index'
import * as tools from '@lsby/js_tools'

describe('测试组', function () {
    it('测试1', async function () {
        var t = new 表<['姓名', '班级'], [string, number]>(['姓名', '班级'])

        t.增加(['小明', 1])
        tools.断言相等(
            JSON.stringify(t.查询(['姓名', '班级'], [['姓名', '==', '小明']]).数据),
            JSON.stringify([['小明', 1]]),
        )

        t.修改('班级', 2, [['姓名', '==', '小明']])
        tools.断言相等(
            JSON.stringify(t.查询(['姓名', '班级'], [['姓名', '==', '小明']]).数据),
            JSON.stringify([['小明', 2]]),
        )

        t.增加(['可达鸭', 3])
        tools.断言相等(
            JSON.stringify(t.查询(['姓名', '班级'], [['姓名', '永真', true]]).数据),
            JSON.stringify([
                ['小明', 2],
                ['可达鸭', 3],
            ]),
        )

        t.删除([['姓名', '==', '小明']])
        tools.断言相等(
            JSON.stringify(t.查询(['姓名', '班级'], [['姓名', '永真', true]]).数据),
            JSON.stringify([['可达鸭', 3]]),
        )

        t.增加(['不可达鸭', 2])
        tools.断言相等(
            JSON.stringify(t.查询(['姓名', '班级'], [['姓名', '永真', true]]).数据),
            JSON.stringify([
                ['可达鸭', 3],
                ['不可达鸭', 2],
            ]),
        )

        tools.断言相等(
            JSON.stringify(t.查询(['姓名'], [['姓名', '永真', true]]).数据),
            JSON.stringify([['可达鸭'], ['不可达鸭']]),
        )
        tools.断言相等(
            JSON.stringify(t.查询(['班级'], [['姓名', '永真', true]]).数据),
            JSON.stringify([[3], [2]]),
        )
        tools.断言相等(
            JSON.stringify(t.查询星([['姓名', '永真', true]]).数据),
            JSON.stringify([
                ['可达鸭', 3],
                ['不可达鸭', 2],
            ]),
        )
        tools.断言相等(
            JSON.stringify(t.无条件查询(['姓名']).数据),
            JSON.stringify([['可达鸭'], ['不可达鸭']]),
        )
        tools.断言相等(
            JSON.stringify(t.查询全部().数据),
            JSON.stringify([
                ['可达鸭', 3],
                ['不可达鸭', 2],
            ]),
        )

        t.删除([
            ['姓名', '==', '可达鸭'],
            ['班级', '==', 2],
        ])
        tools.断言相等(
            JSON.stringify(t.查询全部().数据),
            JSON.stringify([
                ['可达鸭', 3],
                ['不可达鸭', 2],
            ]),
        )

        t.删除([
            ['姓名', '==', '可达鸭'],
            ['班级', '==', 3],
        ])
        tools.断言相等(JSON.stringify(t.查询全部().数据), JSON.stringify([['不可达鸭', 2]]))

        t.增加(['可达鸭', 2])
        tools.断言相等(
            JSON.stringify(t.查询全部().数据),
            JSON.stringify([
                ['不可达鸭', 2],
                ['可达鸭', 2],
            ]),
        )

        t.删除([['班级', '==', 2]])
        tools.断言相等(JSON.stringify(t.查询全部().数据), JSON.stringify([]))
    })
})
