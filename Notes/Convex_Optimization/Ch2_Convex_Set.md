<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>

---
tags:
---
*从本章至第五章，我们将讨论凸优化的理论部分*

---
# Affine and Convex sets

## Affine Sets


> [!note]
> 测试一下callout语法能不能用



**定义**（Affine Sets）

1. 我们称一个集合$C \subset \mathbb R^n$是一个仿射集，如果其中任意两点确定的直线都包含在这个集合内，即：

$$\theta x_1 + (1 - \theta)x_2 \in C, \space where\space x_1, x_2 \in C$$

上面的定义等价于==（为什么？？）== #why？
2. 如果$C \subset \mathbb{R}^n$且对于任意$x_1 ,\cdots, x_n \in C$，$\theta_1 + \cdots +\theta_n = 1$，都有$\theta_1 x_1 + \cdots + \theta_n x_n \in C$，那么称$C$是一个仿射集.

在上面的定义中，$\theta_1 x_1 + \cdots \theta_n x_n$，其中$\bf \theta^T \bf 1 = 1$. 被称为**仿射组合(affine combination)**

### **仿射子空间**

*将一个仿射集沿着任意包含在其中的向量的方向进行平移得到的集合是一个线性子空间，且该线性子空间与选择的向量无关！*

**定理**（线性子空间）

我们假设$C \subset \mathbb{R}^n$是一个仿射集且$x_0 \in C$，那么集合$V = C - x_0 = \{x - x_0 | x \in C\}$是一个子空间.

**证明**

事实上，$\alpha(x_1 - x_0) + \beta(x_2 - x_0) = ((\alpha + \beta)(x_1 + x_2) + (1 - \alpha - \beta)x_0) - x_0. \space \square$

一个仿射集$C$可以写成$V + x_0$，其中$V$是一个线性子空间且$x_0 \in C$. 而且这个子空间与选择的$x_0$无关. ~~#why？~~

**想法** 这件事也许可以用线性方程组理论解释清楚. 假设有一个仿射集$C$，其仿射子空间$V - x_0$. $V$一定是某个齐次线性方程组的解（某个矩阵的零空间），即存在矩阵$A$使得$A v = 0$，那么这个仿射集一定是线性方程组$A v =  b$的解集，其中$b = A  x_0$. 我们将一个仿射集表示成了一个线性方程组的解集，而其线性子空间是对应齐次方程的解，它们的对应当然与$x_0$（非齐次特解）无关.

我们发现一个仿射集可以和一个线性子空间联系起来，一个很自然的想法是定义仿射集的**维数**,这里不再以定义形式写出.

**定义**(affine hull)

$$\mathbf{aff} \space C = \{\theta^T x | x_i \in C, \theta^T 1 = 1\}$$

一个集合的仿射包是包含这个集合的最小仿射集（读者自证不难） #doItYouself 

有了仿射包的概念，我们可以定义一个集合的仿射维数（affine dimesion）和相对内部. 仿射维数指其仿射包的维数. 相对内部是什么呢？

一个集合的内部指其所有内点组成的集合，但是一个集合的仿射包并不见得有内部（比如三维空间的一个平面），我们定义一个集合$C$的相对内部为：

$$
\mathbf{relint} \space C = \{x \in C | B(x, r) \cap \mathbf{aff}C \subset C \subset for\space  some\space r > 0\}
$$

由相对内部，可以定义相对边界为$\mathbf{cl} \space C \backslash \mathbf{relint} \space C$，其中$\mathbf{cl} \space C$为$C$的闭包.

==?==闭包定义？

## Convex Sets

**定义** (Convex Sets)

1. 一个集合是凸集，如果其中任意两点的连接成的线段包含在该集合内，即：

$$\begin{align}
&\theta_1 x_1 + \theta_2 x_2 \in C \space x_1, x_2 \in C, \space 0 \leq\theta_1, \theta_2 \leq1, \space \theta_1 + \theta_2 = 1.
\end{align}
$$

~~(怎么打出来这么丑)~~

类似地，这个定义等价于 #why？ 
2. 我们称一个集合是凸集，如果其中点的任意凸组合都在该集合内，凸组合(convex combination)指$\theta^T x$且$0\leq\theta_i\leq1$, $\theta^T \mathbf{1} = 1$.

**定理**

仿射集是凸集.

可以类似地定义凸包(convex hull).

==凸组合与概率分布==：假设$C$是一个凸集，$x\in C$是随机变量，那么$\mathbf{E}x \in C$.

## Cones

affine combination要求所有系数和为1，convex combination在此基础上要求系数大于0，conic combination则只要求所有系数大于0，仿照上面可以给出锥、锥包的定义.

---

# Examples

