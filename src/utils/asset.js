// 静态资源路径：适配部署在子路径（GitHub Pages 项目页）的情况
export const asset = (path) => import.meta.env.BASE_URL + path
