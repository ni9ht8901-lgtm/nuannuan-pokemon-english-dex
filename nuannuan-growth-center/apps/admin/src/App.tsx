import { useMemo, useState } from "react";
import projects from "../../../registry/discovered-projects.json";
import migrationStatus from "../../../registry/migration-status.json";
import pictureBooks from "../../../registry/picture-books.json";

type Project = (typeof projects)[number];
type ProjectTypeFilter = "all" | "pwa" | "picture_book" | "pending" | "blocked";

const blockers = [
  "GitHub 授权：扫描个人账号和组织仓库、创建 PR、同步 Actions 状态。",
  "Supabase 项目：执行迁移、启用 Auth、写入真实家庭数据。",
  "Vercel 或部署平台授权：发布管理后台并回写部署状态。",
  "真实设备：iPhone、iPad、电脑跨设备同步验收。"
];

const statusLabel: Record<string, string> = {
  discovered: "已发现",
  pending_confirmation: "待确认",
  archive_indexed: "档案已收录",
  integrated: "已完整接入",
  failed: "接入失败"
};

const typeLabel: Record<string, string> = {
  pwa: "PWA",
  picture_book: "绘本",
  web_app: "网页工具",
  unknown: "待确认"
};

export function App() {
  const [filter, setFilter] = useState<ProjectTypeFilter>("all");
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (filter === "all") return true;
      if (filter === "pending") return project.status === "pending_confirmation";
      if (filter === "blocked") return project.type === "pwa";
      return project.type === filter;
    });
  }, [filter]);

  const metrics = useMemo(() => {
    const pwaCount = projects.filter((project) => project.type === "pwa").length;
    const pictureBookCount = projects.filter((project) => project.type === "picture_book").length;
    const fullyIntegrated = migrationStatus.filter((item) => item.status === "integrated").length;
    const pending = projects.filter((project) => project.status === "pending_confirmation").length;
    const notIntegrated = projects.length - fullyIntegrated;

    return [
      { label: "发现项目", value: projects.length, tone: "blue" },
      { label: "PWA", value: pwaCount, tone: "green" },
      { label: "绘本", value: pictureBookCount, tone: "amber" },
      { label: "待完整接入", value: notIntegrated, tone: "red" },
      { label: "待确认", value: pending, tone: "gray" },
      { label: "绘本文件", value: pictureBooks.length, tone: "violet" }
    ];
  }, []);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">暖</span>
          <div>
            <strong>暖暖 AI 成长中心</strong>
            <span>家庭数字项目总控</span>
          </div>
        </div>
        <nav aria-label="主导航">
          <a href="#overview">总览</a>
          <a href="#library">项目库</a>
          <a href="#migration">迁移控制台</a>
          <a href="#blockers">阻塞项</a>
        </nav>
      </aside>

      <main className="content">
        <section id="overview" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">本地第一阶段</p>
              <h1>真实扫描登记</h1>
            </div>
            <span className="sync-pill">等待云端权限</span>
          </div>

          <div className="metric-grid">
            {metrics.map((metric) => (
              <article className={`metric-card tone-${metric.tone}`} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="library" className="section">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">项目库</p>
              <h2>全部可访问项目</h2>
            </div>
            <div className="tabs" role="tablist" aria-label="项目筛选">
              {[
                ["all", "全部"],
                ["pwa", "PWA"],
                ["picture_book", "绘本"],
                ["pending", "待确认"],
                ["blocked", "缺少权限"]
              ].map(([value, label]) => (
                <button
                  className={filter === value ? "active" : ""}
                  key={value}
                  onClick={() => setFilter(value as ProjectTypeFilter)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={`${project.type}-${project.localPath}`} project={project} />
            ))}
          </div>
        </section>

        <section id="migration" className="section">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">迁移控制台</p>
              <h2>接入进度</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>状态</th>
                  <th>已分析</th>
                  <th>已备份</th>
                  <th>已接入</th>
                  <th>阻塞</th>
                </tr>
              </thead>
              <tbody>
                {migrationStatus.map((item) => (
                  <tr key={`${item.projectId}-${item.name}`}>
                    <td>{item.name}</td>
                    <td>{statusLabel[item.status] ?? item.status}</td>
                    <td>{item.steps.analyzed ? "是" : "否"}</td>
                    <td>{item.steps.backedUp ? "是" : "否"}</td>
                    <td>{item.steps.integrated ? "是" : "否"}</td>
                    <td>{item.blockers.length ? item.blockers.join("；") : "无"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="blockers" className="section">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">权限</p>
              <h2>一次性阻塞项</h2>
            </div>
          </div>
          <div className="blocker-list">
            {blockers.map((item) => (
              <div className="blocker" key={item}>
                <span aria-hidden="true">!</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const image = project.type === "picture_book" ? "/covers/picture-book.svg" : "/covers/pwa.svg";
  const status = statusLabel[project.status] ?? project.status;
  const type = typeLabel[project.type] ?? project.type;

  return (
    <article className="project-card">
      <img alt="" className="project-cover" src={image} />
      <div className="project-body">
        <div className="project-title">
          <h3>{project.name}</h3>
          <span>{type}</span>
        </div>
        <dl>
          <div>
            <dt>状态</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>置信度</dt>
            <dd>{project.confidence}%</dd>
          </div>
          <div>
            <dt>存储</dt>
            <dd>{project.currentStorage}</dd>
          </div>
          <div>
            <dt>难度</dt>
            <dd>{difficultyLabel(project.migrationDifficulty)}</dd>
          </div>
        </dl>
        <p className="path">{project.localPath}</p>
      </div>
    </article>
  );
}

function difficultyLabel(value: string) {
  if (value === "low") return "低";
  if (value === "medium") return "中";
  if (value === "high") return "高";
  return value;
}
