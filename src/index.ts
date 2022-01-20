import { 字符串转数字, 后继数, 元组转联合 } from '@lsby/ts_type_fun'

type 计算数组第一个元素的下标<
    数组 extends any[],
    值,
    位置 extends string = '0',
> = 字符串转数字<位置> extends 数组['length']
    ? never
    : 数组[字符串转数字<位置>] extends 值
    ? 位置
    : 计算数组第一个元素的下标<数组, 值, 后继数<位置>>

type 计算子类型<
    列们 extends [...any],
    子列们 extends [...any],
    类型 extends [...any],
> = 子列们['length'] extends 0
    ? []
    : 子列们 extends [infer a, ...infer as]
    ? [类型[字符串转数字<计算数组第一个元素的下标<列们, a>>], ...计算子类型<列们, as, 类型>]
    : never

export type 条件操作 = '==' | '>' | '<' | '>=' | '<=' | '!=' | '包含' | '永真' | '永假'

export function 计算条件操作函数(条件操作: 条件操作) {
    if (条件操作 == '!=') return (a: any, b: any) => a != b
    else if (条件操作 == '<') return (a: any, b: any) => a < b
    else if (条件操作 == '<=') return (a: any, b: any) => a <= b
    else if (条件操作 == '==') return (a: any, b: any) => a == b
    else if (条件操作 == '>') return (a: any, b: any) => a > b
    else if (条件操作 == '>=') return (a: any, b: any) => a >= b
    else if (条件操作 == '包含') return (a: any, b: any) => a.toString().indexOf(b.toString()) != -1
    else if (条件操作 == '永假') return () => false
    else if (条件操作 == '永真') return () => true
    var 类型检查: never = 条件操作
    throw '意外的条件操作'
}

export class 表<列名 extends string[], 类型 extends [...any]> {
    constructor(public 列名: 列名) {}

    public 数据: 类型[] = []

    public 增加(值: 类型): 表<列名, 类型> {
        this.数据.push(值)
        return this
    }
    public 删除(条件们: [元组转联合<列名>, 条件操作, any][]): 表<列名, 类型> {
        var r: any = []
        for (var 行 of this.数据) {
            var 判断结果 = (() => {
                for (var 条件 of 条件们) {
                    var 位置 = this.列名.findIndex((v) => v == 条件[0])
                    var 条件操作函数 = 计算条件操作函数(条件[1])
                    var 判断结果 = 条件操作函数(行[位置], 条件[2])
                    if (判断结果 == false) return false
                }
                return true
            })()
            if (判断结果 == true) continue
            r.push(行)
        }
        this.数据 = r
        return this
    }
    public 修改<n extends 元组转联合<列名>>(
        列名: n,
        新值: 类型[字符串转数字<计算数组第一个元素的下标<列名, n>>],
        条件们: [元组转联合<列名>, 条件操作, any][],
    ): 表<列名, 类型> {
        var 修改位置 = this.列名.findIndex((v) => v == 列名)
        for (var 行 of this.数据) {
            var 判断结果 = (() => {
                for (var 条件 of 条件们) {
                    var 位置 = this.列名.findIndex((v) => v == 条件[0])
                    var 条件操作函数 = 计算条件操作函数(条件[1])
                    var 判断结果 = 条件操作函数(行[位置], 条件[2])
                    if (判断结果 == false) return false
                }
                return true
            })()
            if (判断结果 == false) continue
            行[修改位置] = 新值
        }
        return this
    }
    public 查询<A extends 元组转联合<列名>[]>(
        列名: [...A],
        条件们: [元组转联合<列名>, 条件操作, any][],
    ) {
        var r: any = []
        for (var 行 of this.数据) {
            var 判断结果 = (() => {
                for (var 条件 of 条件们) {
                    var 位置 = this.列名.findIndex((v) => v == 条件[0])
                    var 条件操作函数 = 计算条件操作函数(条件[1])
                    var 判断结果 = 条件操作函数(行[位置], 条件[2])
                    if (判断结果 == false) return false
                }
                return true
            })()
            if (判断结果 == false) continue
            r.push(行)
        }

        var 选择位置 = [...new Set(列名.map((a) => this.列名.findIndex((v) => v == a)))]
        r = r.map((row: 类型) => row.filter((_, i) => 选择位置.includes(i)))

        var rx = new 表<A, 计算子类型<列名, A, 类型>>(列名)
        rx.数据 = r

        return rx
    }

    public 查询星(条件们: [元组转联合<列名>, 条件操作, any][]): 表<列名, 类型> {
        return this.查询(this.列名 as any, 条件们) as any
    }

    public 无条件查询<A extends 元组转联合<列名>[]>(
        列名: [...A],
    ): 表<A, 计算子类型<列名, A, 类型>> {
        return this.查询(列名 as any, [['' as any, '永真', '']])
    }

    public 查询全部(): 表<列名, 类型> {
        return this.无条件查询(this.列名 as any) as any
    }
}
