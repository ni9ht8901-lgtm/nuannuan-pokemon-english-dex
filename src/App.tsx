import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerSW } from "virtual:pwa-register";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const visualRefs = {
  board: "./visual-refs/board.png",
  home: "./visual-refs/home.png",
  identity: "./visual-refs/identity.png",
  train: "./visual-refs/train.png",
  tone: "./visual-refs/tone.png",
  report: "./visual-refs/report.png"
};

type Mode = "english" | "pinyin";
type View = "onboarding" | "home" | "identity" | "train" | "tone" | "recordings" | "report";
type TaskId = "identity" | "train" | "tone";
type ErrorType = "mode" | "symbol" | "blend" | "tone" | "operation";

type AnswerEvent = {
  id: string;
  taskId: TaskId;
  questionId: string;
  correct: boolean;
  attempts: number;
  errorType?: ErrorType;
  elapsedMs: number;
  at: string;
};

type RecordingItem = {
  id: string;
  label: string;
  url: string;
  createdAt: string;
};

type Progress = {
  childName: string;
  avatar: string;
  mode: Mode;
  stars: number;
  stickerIds: string[];
  completedTaskIds: TaskId[];
  events: AnswerEvent[];
  recordings: RecordingItem[];
  onboarded: boolean;
};

const STORAGE_KEY = "letter-transform-station-progress-v1";

const defaultProgress: Progress = {
  childName: "暖暖",
  avatar: "hoodie",
  mode: "pinyin",
  stars: 0,
  stickerIds: [],
  completedTaskIds: [],
  events: [],
  recordings: [],
  onboarded: false
};

const tasks: Array<{ id: TaskId; title: string; minutes: string; view: View; icon: string }> = [
  { id: "identity", title: "听声音，找身份", minutes: "3题", view: "identity", icon: "♪" },
  { id: "train", title: "拼音小火车", minutes: "2题", view: "train", icon: "→" },
  { id: "tone", title: "声调过山车", minutes: "2题", view: "tone", icon: "~" }
];

const copy = {
  correct: ["找到了，就是它！", "频道切得真快。"],
  retry: ["字母没有变，世界变了。再看看现在是哪种模式。", "差一点。先看看现在是哪种模式。"]
};

const identityQuestions = [
  {
    id: "d1-id-001",
    mode: "pinyin" as Mode,
    prompt: "听一听，这是谁的声音？",
    soundText: "拼音 m，嘴巴轻轻闭上，m。",
    options: [
      { id: "opt-m", display: "m", helper: "拼音声母" },
      { id: "opt-a", display: "a", helper: "拼音韵母" }
    ],
    correctAnswer: "opt-m",
    errorType: "symbol" as ErrorType
  },
  {
    id: "d1-id-002",
    mode: "english" as Mode,
    prompt: "看见 a 在森林里，它是哪种身份？",
    soundText: "English Mode, letter a says apple sound.",
    options: [
      { id: "english-a", display: "English a", helper: "自然森林" },
      { id: "pinyin-a", display: "拼音 a", helper: "灯笼小镇" },
      { id: "pinyin-m", display: "拼音 m", helper: "声母朋友" }
    ],
    correctAnswer: "english-a",
    errorType: "mode" as ErrorType
  },
  {
    id: "d1-id-003",
    mode: "pinyin" as Mode,
    prompt: "找出混进拼音世界的卡片。",
    soundText: "现在是拼音模式，先看世界再开口。",
    options: [
      { id: "pinyin-ma", display: "ma", helper: "拼音小火车" },
      { id: "english-m", display: "English m", helper: "自然森林" },
      { id: "pinyin-a", display: "a", helper: "拼音韵母" }
    ],
    correctAnswer: "english-m",
    errorType: "mode" as ErrorType
  }
];

const trainQuestions = [
  {
    id: "d1-tr-001",
    initial: "m",
    final: "a",
    result: "ma",
    toned: "mā",
    word: "妈妈",
    scene: "熟悉的人"
  },
  {
    id: "d1-tr-002",
    initial: "m",
    final: "a",
    result: "ma",
    toned: "mǎ",
    word: "蚂蚁",
    scene: "小小昆虫"
  }
];

const toneQuestions = [
  { id: "d1-to-001", base: "ma", display: "mā", tone: 1, word: "妈妈", audio: "一声，平平走。" },
  { id: "d1-to-002", base: "ma", display: "mà", tone: 4, word: "轻轻一落", audio: "四声，从高到低滑下来。" }
];

registerSW({ immediate: true });

export function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [view, setView] = useState<View>(() => (loadProgress().onboarded ? "home" : "onboarding"));

  useEffect(() => {
    loadProgressFromIndexedDB().then((stored) => {
      if (stored) {
        setProgress(stored);
        setView(stored.onboarded ? "home" : "onboarding");
      }
    });
  }, []);

  const save = (next: Progress) => {
    setProgress(next);
    persistProgress(next);
  };

  const completeTask = (taskId: TaskId, event: AnswerEvent) => {
    const completedTaskIds = progress.completedTaskIds.includes(taskId)
      ? progress.completedTaskIds
      : [...progress.completedTaskIds, taskId];
    const allDone = completedTaskIds.length === tasks.length;
    const stickerIds = allDone && !progress.stickerIds.includes("sticker-switch-day1")
      ? [...progress.stickerIds, "sticker-switch-day1"]
      : progress.stickerIds;
    playSoundEffect(allDone ? "reward" : "correct");
    save({
      ...progress,
      events: [...progress.events, event],
      completedTaskIds,
      stickerIds,
      stars: Math.max(progress.stars, completedTaskIds.length)
    });
  };

  const nextTask = tasks.find((task) => !progress.completedTaskIds.includes(task.id)) ?? tasks[0];
  const screen = view === "onboarding" ? (
    <Onboarding progress={progress} onDone={(next) => { playSoundEffect("start"); save(next); setView("home"); }} />
  ) : view === "identity" ? (
    <IdentityGame
      mode={progress.mode}
      onModeChange={(mode) => save({ ...progress, mode })}
      onDone={(event) => { completeTask("identity", event); setView("home"); }}
      onBack={() => setView("home")}
    />
  ) : view === "train" ? (
    <PinyinTrain onDone={(event) => { completeTask("train", event); setView("home"); }} onBack={() => setView("home")} />
  ) : view === "tone" ? (
    <ToneCoaster
      recordings={progress.recordings}
      onRecordings={(recordings) => save({ ...progress, recordings })}
      onDone={(event) => { completeTask("tone", event); setView("home"); }}
      onBack={() => setView("home")}
    />
  ) : view === "recordings" ? (
    <Recordings progress={progress} onSave={save} onBack={() => setView("home")} />
  ) : view === "report" ? (
    <ParentReport progress={progress} onPractice={(taskId) => setView(taskId)} onBack={() => setView("home")} />
  ) : (
    <Home
      progress={progress}
      nextTask={nextTask}
      onModeChange={(mode) => save({ ...progress, mode })}
      onStart={() => { playSoundEffect("start"); setView(nextTask.view); }}
      onOpen={(nextView) => { playSoundEffect(nextView === "report" ? "tap" : "start"); setView(nextView); }}
      onResetOnboarding={() => save({ ...progress, onboarded: false })}
    />
  );

  return (
    <div className={`app-shell mode-${progress.mode}`}>
      <AnimatePresence mode="wait">
        <motion.main key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {screen}
        </motion.main>
      </AnimatePresence>
      {view !== "onboarding" && <BottomNav active={view} onOpen={setView} />}
    </div>
  );
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function persistProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  saveProgressToIndexedDB(progress);
}

async function openLetterDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("letter-transform-station", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("progress");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveProgressToIndexedDB(progress: Progress) {
  if (!("indexedDB" in window)) return;
  try {
    const db = await openLetterDB();
    const tx = db.transaction("progress", "readwrite");
    tx.objectStore("progress").put(progress, "current");
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

async function loadProgressFromIndexedDB() {
  if (!("indexedDB" in window)) return undefined;
  try {
    const db = await openLetterDB();
    return await new Promise<Progress | undefined>((resolve) => {
      const tx = db.transaction("progress", "readonly");
      const request = tx.objectStore("progress").get("current");
      request.onsuccess = () => resolve(request.result ? { ...defaultProgress, ...request.result } : undefined);
      request.onerror = () => resolve(undefined);
    });
  } catch {
    return undefined;
  }
}

function Onboarding({ progress, onDone }: { progress: Progress; onDone: (progress: Progress) => void }) {
  const [childName, setChildName] = useState(progress.childName);
  const [avatar, setAvatar] = useState(progress.avatar);

  return (
    <section className="page center-page">
      <div className="brand-mark">字</div>
      <p className="eyebrow">同一个字母，两种声音</p>
      <h1>字母变身局</h1>
      <p className="lead">先看世界，再开口。今天先认识 English Mode 和拼音模式。</p>
      <div className="onboarding-card">
        <label>
          小朋友昵称
          <input value={childName} maxLength={12} onChange={(event) => setChildName(event.target.value)} />
        </label>
        <div className="avatar-row" aria-label="选择头像">
          {["hoodie", "leaf", "lantern"].map((item) => (
            <button key={item} className={avatar === item ? "avatar selected" : "avatar"} onClick={() => setAvatar(item)} type="button">
              {item === "hoodie" ? "暖" : item === "leaf" ? "森" : "灯"}
            </button>
          ))}
        </div>
        <button className="primary-button" type="button" onClick={() => onDone({ ...progress, childName, avatar, onboarded: true })}>
          进入第一天任务
        </button>
        <button className="ghost-button" type="button" onClick={() => onDone({ ...progress, onboarded: true })}>
          跳过，稍后设置
        </button>
      </div>
    </section>
  );
}

function Home({
  progress,
  nextTask,
  onModeChange,
  onStart,
  onOpen,
  onResetOnboarding
}: {
  progress: Progress;
  nextTask: { id: TaskId; title: string; minutes: string; view: View; icon: string };
  onModeChange: (mode: Mode) => void;
  onStart: () => void;
  onOpen: (view: View) => void;
  onResetOnboarding: () => void;
}) {
  const done = progress.completedTaskIds.length === tasks.length;

  return (
    <section className="page home-screen">
      <div className="hero-panel">
        <div className="topline">
          <div>
            <h1 className="candy-logo">字母变身局</h1>
            <p className="tagline">今天继续变身吧！</p>
          </div>
          <div className="profile-pill">
            <div className="kid-badge">{progress.childName.slice(0, 1)}</div>
            <strong>{progress.childName}</strong>
            <span>★ {progress.stars + 12}</span>
          </div>
        </div>
        <WorldSwitch mode={progress.mode} onChange={onModeChange} />
      </div>

      <aside className="task-panel">
        <h2 className="section-title">★ 今日任务</h2>
        <div className="progress-card">
          <span>今日进度</span>
          <strong>{progress.completedTaskIds.length}/3</strong>
        </div>
        {tasks.map((task) => (
          <button key={task.id} className={`task-card task-${task.id}`} type="button" onClick={() => onOpen(task.view)}>
            <span className="task-icon">{task.icon}</span>
            <span>
              <strong>{task.title}</strong>
              <small>{progress.completedTaskIds.includes(task.id) ? "已完成，可重玩" : task.minutes}</small>
            </span>
            <b>{progress.completedTaskIds.includes(task.id) ? "完成" : "开始"}</b>
          </button>
        ))}
        {done && (
          <div className="reward-card">
            <strong>今日贴纸已解锁</strong>
            <span>变身开关贴纸 · 今日总结：能分清两个世界了。</span>
          </div>
        )}
        <button className="primary-button wide start-challenge" type="button" onClick={onStart}>
          开始挑战
        </button>
        <button className="ghost-button" type="button" onClick={() => onOpen("report")}>家长报告</button>
        <button className="ghost-button" type="button" onClick={onResetOnboarding}>重看首次引导</button>
      </aside>
    </section>
  );
}

function WorldSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const [announcing, setAnnouncing] = useState(false);
  const switchMode = () => {
    const next = mode === "english" ? "pinyin" : "english";
    onChange(next);
    setAnnouncing(true);
    playSoundEffect(next === "english" ? "modeEnglish" : "modePinyin");
    speak(next === "english" ? "现在是英语模式" : "现在是拼音模式");
    window.setTimeout(() => setAnnouncing(false), 700);
  };

  return (
    <div className="world-switch">
      <div className={mode === "english" ? "world-card active english" : "world-card english"}>
        <img src={visualRefs.home} alt="" />
        <strong>English Mode</strong>
        <span>自然森林世界</span>
      </div>
      <button className={announcing ? "switch-button switching" : "switch-button"} type="button" onClick={switchMode}>
        变身开关
      </button>
      <div className={mode === "pinyin" ? "world-card active pinyin" : "world-card pinyin"}>
        <img src={visualRefs.home} alt="" />
        <strong>拼音模式</strong>
        <span>灯笼小镇世界</span>
      </div>
    </div>
  );
}

function IdentityGame({ mode, onModeChange, onDone, onBack }: { mode: Mode; onModeChange: (mode: Mode) => void; onDone: (event: AnswerEvent) => void; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [feedback, setFeedback] = useState("先听声音，再看现在是哪种模式。");
  const startedAt = useRef(Date.now());
  const question = identityQuestions[index];
  const visibleOptions = attempts >= 2 ? question.options.filter((option) => option.id === question.correctAnswer || option.id === selected) : question.options;

  useEffect(() => onModeChange(question.mode), [question.mode]);

  const answer = (optionId: string) => {
    setSelected(optionId);
    if (optionId === question.correctAnswer) {
      playSoundEffect("correct");
      setFeedback(copy.correct[index % copy.correct.length]);
      if (index === identityQuestions.length - 1) {
        onDone(makeEvent("identity", question.id, true, attempts + 1, undefined, startedAt.current));
      } else {
        window.setTimeout(() => { setIndex(index + 1); setAttempts(0); setSelected(undefined); setFeedback("下一题，先看世界。"); }, 500);
      }
      return;
    }
    setAttempts(attempts + 1);
    playSoundEffect("retry");
    setFeedback(attempts >= 1 ? "我把选择变少了，再听一次对比音。" : copy.retry[0]);
  };

  return (
    <GameShell title="听声音，找身份" mode={mode} art={visualRefs.identity} onBack={onBack}>
      <p className="game-prompt">{question.prompt}</p>
      <button className="sound-button" type="button" onClick={() => { playSoundEffect("listen"); speak(question.soundText); }}>播放标准音</button>
      <div className="answer-grid">
        {visibleOptions.map((option) => (
          <button key={option.id} className={selected === option.id ? "answer-card selected" : "answer-card"} type="button" onClick={() => answer(option.id)}>
            <strong>{option.display}</strong>
            <span>{option.helper}</span>
          </button>
        ))}
      </div>
      <p className="feedback">{feedback}</p>
    </GameShell>
  );
}

function PinyinTrain({ onDone, onBack }: { onDone: (event: AnswerEvent) => void; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [cars, setCars] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("点击或拖动两节车厢到火车上。");
  const startedAt = useRef(Date.now());
  const question = trainQuestions[index];
  const done = cars.includes(question.initial) && cars.includes(question.final);

  const addCar = (value: string) => {
    if (!cars.includes(value)) {
      playSoundEffect("car");
      setCars([...cars, value]);
    }
  };

  const finish = () => {
    playSoundEffect("train");
    speak(`${question.initial} 加 ${question.final}，慢慢靠近，${question.result}，${question.toned}，${question.word}`);
    if (index === trainQuestions.length - 1) {
      onDone(makeEvent("train", question.id, true, 1, undefined, startedAt.current));
    } else {
      setIndex(index + 1);
      setCars([]);
      setFeedback("下一列小火车来了。");
    }
  };

  return (
    <GameShell title="拼音小火车" mode="pinyin" art={visualRefs.train} onBack={onBack}>
      <p className="game-prompt">把声母和韵母拼起来。</p>
      <div className="train-yard">
        {[question.initial, question.final].map((car) => (
          <button key={car} draggable className={car === question.initial ? "train-car initial" : "train-car final"} type="button" onClick={() => addCar(car)} onDragStart={(event) => event.dataTransfer.setData("text/plain", car)}>
            {car}
          </button>
        ))}
      </div>
      <div className="track" onDragOver={(event) => event.preventDefault()} onDrop={(event) => addCar(event.dataTransfer.getData("text/plain"))}>
        <span>{cars[0] ?? "声母"}</span>
        <b>+</b>
        <span>{cars[1] ?? "韵母"}</span>
        <b>=</b>
        <strong>{done ? question.toned : question.result}</strong>
      </div>
      <div className="scene-card">
        <strong>{question.word}</strong>
        <span>{question.scene}</span>
      </div>
      <button className="primary-button" type="button" disabled={!done} onClick={finish}>播放拼合并完成</button>
      <p className="feedback">{feedback}</p>
    </GameShell>
  );
}

function ToneCoaster({
  recordings,
  onRecordings,
  onDone,
  onBack
}: {
  recordings: RecordingItem[];
  onRecordings: (items: RecordingItem[]) => void;
  onDone: (event: AnswerEvent) => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [feedback, setFeedback] = useState("先听目标音，再沿轨迹滑一滑。");
  const startedAt = useRef(Date.now());
  const question = toneQuestions[index];

  const choose = (tone: number) => {
    setChoice(tone);
    if (tone !== question.tone) {
      playSoundEffect("retry");
      setFeedback("这条轨迹还没对上声音。看一看小车是平走还是落下。");
      return;
    }
    playSoundEffect("tone");
    setFeedback(copy.correct[0]);
    if (index === toneQuestions.length - 1) {
      onDone(makeEvent("tone", question.id, true, 1, undefined, startedAt.current));
    } else {
      window.setTimeout(() => { setIndex(index + 1); setChoice(undefined); setFeedback("下一条声调轨迹。"); }, 500);
    }
  };

  return (
    <GameShell title="声调过山车" mode="pinyin" art={visualRefs.tone} onBack={onBack}>
      <p className="game-prompt">{question.display} · {question.word}</p>
      <button className="sound-button" type="button" onClick={() => { playSoundEffect("listen"); speak(question.audio); }}>播放目标音</button>
      <div className="tone-grid">
        {[1, 2, 3, 4].map((tone) => (
          <button key={tone} className={choice === tone ? "tone-card selected" : "tone-card"} type="button" onClick={() => choose(tone)}>
            <TonePath tone={tone} />
            <span>{tone}声</span>
          </button>
        ))}
      </div>
      <Recorder label={question.display} recordings={recordings} onRecordings={onRecordings} />
      <p className="feedback">{feedback}</p>
    </GameShell>
  );
}

function TonePath({ tone }: { tone: number }) {
  const paths: Record<number, string> = {
    1: "M14 48 H142",
    2: "M14 62 C52 60 86 34 142 18",
    3: "M14 26 C48 70 90 72 142 22",
    4: "M14 18 C58 24 92 48 142 66"
  };

  return (
    <svg viewBox="0 0 156 84" aria-hidden>
      <path d={paths[tone]} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <circle className="coaster-dot" cx={tone === 4 ? "142" : "28"} cy={tone === 4 ? "66" : tone === 2 ? "58" : tone === 3 ? "36" : "48"} r="9" />
    </svg>
  );
}

function Recorder({ label, recordings, onRecordings }: { label: string; recordings: RecordingItem[]; onRecordings: (items: RecordingItem[]) => void }) {
  const [status, setStatus] = useState("录音只保存在本机，家长同意前不上传。");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    if (!("MediaRecorder" in window)) {
      setStatus("这个浏览器暂时不能录音，可以继续完成课程。");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        onRecordings([{ id: crypto.randomUUID(), label, url, createdAt: new Date().toISOString() }, ...recordings].slice(0, 8));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setStatus("正在录音，最多10秒。");
      window.setTimeout(() => recorder.state === "recording" && recorder.stop(), 10000);
    } catch {
      setStatus("没有麦克风权限也没关系，可以先听标准音继续练习。");
    }
  };

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setStatus("录好了，可以回听。");
  };

  return (
    <div className="recorder">
      <div className="recorder-actions">
        <button className="ghost-button" type="button" onClick={start}>录音</button>
        <button className="ghost-button" type="button" onClick={stop}>停止</button>
      </div>
      <span>{status}</span>
    </div>
  );
}

function Recordings({ progress, onSave, onBack }: { progress: Progress; onSave: (progress: Progress) => void; onBack: () => void }) {
  return (
    <section className="page narrow-page">
      <button className="back-button" type="button" onClick={onBack}>返回</button>
      <h1>我的录音</h1>
      {progress.recordings.length === 0 ? <p className="lead">还没有录音。去声调过山车录一段。</p> : progress.recordings.map((item) => (
        <div className="recording-row" key={item.id}>
          <strong>{item.label}</strong>
          <audio controls src={item.url} />
          <button type="button" onClick={() => onSave({ ...progress, recordings: progress.recordings.filter((recording) => recording.id !== item.id) })}>删除</button>
        </div>
      ))}
    </section>
  );
}

function ParentReport({ progress, onPractice, onBack }: { progress: Progress; onPractice: (taskId: TaskId) => void; onBack: () => void }) {
  const weakItems = useMemo(() => buildWeakItems(progress.events), [progress.events]);
  const weekDone = progress.completedTaskIds.length;

  return (
    <section className="page report-page">
      <img className="report-art" src={visualRefs.report} alt="" />
      <button className="back-button" type="button" onClick={onBack}>返回</button>
      <p className="eyebrow">家长报告</p>
      <h1>{progress.childName} 的今日学习</h1>
      <div className="report-grid">
        <ReportStat label="今日完成" value={`${progress.completedTaskIds.length}/3`} />
        <ReportStat label="本周进步" value={`${weekDone} 项`} />
        <ReportStat label="星星" value={`${progress.stars}`} />
      </div>
      <h2>容易混淆</h2>
      <div className="weak-list">
        {weakItems.length === 0 ? <p>目前没有明显易错项。完成更多题目后会自动更新。</p> : weakItems.slice(0, 3).map((item) => (
          <button key={item.type} type="button" onClick={() => onPractice(item.taskId)}>
            <strong>{item.label}</strong>
            <span>原因：{item.reason} · 建议3分钟</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function GameShell({ title, mode, art, onBack, children }: { title: string; mode: Mode; art?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <section className={`page narrow-page game-shell mode-${mode}`}>
      {art && <img className="game-art" src={art} alt="" />}
      <div className="game-topbar">
        <button className="back-button" type="button" onClick={onBack}>返回</button>
        <span>{mode === "english" ? "English Mode · 自然森林" : "拼音模式 · 灯笼小镇"}</span>
      </div>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function BottomNav({ active, onOpen }: { active: View; onOpen: (view: View) => void }) {
  const items: Array<{ view: View; label: string }> = [
    { view: "home", label: "首页" },
    { view: "identity", label: "练习" },
    { view: "recordings", label: "录音" },
    { view: "report", label: "家长" }
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.view} className={active === item.view ? "active" : ""} type="button" onClick={() => onOpen(item.view)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function Character({ name, text, tone }: { name: string; text: string; tone: string }) {
  return (
    <div className={`character ${tone}`}>
      <span>{name.slice(0, 1)}</span>
      <div>
        <strong>{name}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="report-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildWeakItems(events: AnswerEvent[]) {
  const labels: Record<ErrorType, { label: string; reason: string; taskId: TaskId }> = {
    mode: { label: "模式未切换", reason: "同一个字母在两个世界里声音不同", taskId: "identity" },
    symbol: { label: "字母/音节识别", reason: "m 和 a 的身份还需要多听", taskId: "identity" },
    blend: { label: "声母韵母拼合", reason: "拼合时需要慢慢靠近再合成", taskId: "train" },
    tone: { label: "声调辨听", reason: "轨迹和音高变化还没稳定对应", taskId: "tone" },
    operation: { label: "操作未完成", reason: "拖动或点击步骤需要更清楚", taskId: "train" }
  };
  const counts = events.reduce<Record<string, number>>((acc, event) => {
    if (event.errorType) acc[event.errorType] = (acc[event.errorType] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => ({ type: type as ErrorType, ...labels[type as ErrorType] }));
}

function makeEvent(taskId: TaskId, questionId: string, correct: boolean, attempts: number, errorType: ErrorType | undefined, startedAt: number): AnswerEvent {
  return {
    id: crypto.randomUUID(),
    taskId,
    questionId,
    correct,
    attempts,
    errorType,
    elapsedMs: Date.now() - startedAt,
    at: new Date().toISOString()
  };
}

type SoundEffect =
  | "tap"
  | "start"
  | "listen"
  | "correct"
  | "retry"
  | "reward"
  | "modeEnglish"
  | "modePinyin"
  | "car"
  | "train"
  | "tone";

let audioContext: AudioContext | undefined;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return undefined;
  audioContext ??= new AudioContextClass();
  return audioContext;
}

function playSoundEffect(effect: SoundEffect) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const patterns: Record<SoundEffect, Array<[number, number, number]>> = {
    tap: [[520, 0, 0.055]],
    start: [[392, 0, 0.08], [523.25, 0.08, 0.11], [659.25, 0.18, 0.14]],
    listen: [[659.25, 0, 0.08], [783.99, 0.09, 0.08]],
    correct: [[523.25, 0, 0.08], [659.25, 0.08, 0.1], [783.99, 0.17, 0.12]],
    retry: [[330, 0, 0.08], [293.66, 0.09, 0.09]],
    reward: [[523.25, 0, 0.08], [659.25, 0.08, 0.08], [783.99, 0.16, 0.08], [1046.5, 0.25, 0.16]],
    modeEnglish: [[392, 0, 0.08], [587.33, 0.08, 0.12]],
    modePinyin: [[440, 0, 0.08], [659.25, 0.08, 0.12]],
    car: [[220, 0, 0.06], [330, 0.06, 0.06]],
    train: [[196, 0, 0.08], [246.94, 0.08, 0.08], [392, 0.18, 0.16]],
    tone: [[440, 0, 0.1], [554.37, 0.09, 0.1], [659.25, 0.18, 0.12]]
  };

  patterns[effect].forEach(([frequency, delay, duration], index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = effect === "retry" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.13 : 0.1, ctx.currentTime + delay + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration + 0.02);
  });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.86;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}
