import * as cheerio from 'cheerio';

let _gotScraping: any = null;
async function getGotScraping() {
  if (!_gotScraping) {
    const mod: any = await import('got-scraping');
    _gotScraping = mod.gotScraping || mod.default?.gotScraping || mod.default || mod;
  }
  return _gotScraping;
}

export const BASE_URL = 'https://id.akinator.com';
export const THEMES = { characters: 1, animals: 14, objects: 2 };

export const ANSWERS_MAP: Record<string, number> = {
  // Numbers
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  // English
  'yes': 0,
  'y': 0,
  'no': 1,
  'n': 1,
  'idk': 2,
  'dont know': 2,
  'probably': 3,
  'probably not': 4,
  // Indonesian
  'ya': 0,
  'iya': 0,
  'yoi': 0,
  'yes bro': 0,
  'tidak': 1,
  'tdk': 1,
  'ngga': 1,
  'gak': 1,
  'enggak': 1,
  'bukan': 1,
  'tidak tahu': 2,
  'gatau': 2,
  'kurang tahu': 2,
  'entah': 2,
  'mungkin': 3,
  'bisa jadi': 3,
  'kayaknya': 3,
  'mungkin tidak': 4,
  'mungkin ngga': 4,
  'mungkin tdk': 4,
  'kayaknya bukan': 4,
  'bukan kayaknya': 4
};

export const ANSWER_LABELS = [
  '0️⃣ *Ya* (0)',
  '1️⃣ *Tidak* (1)',
  '2️⃣ *Tidak Tahu* (2)',
  '3️⃣ *Mungkin / Bisa Jadi* (3)',
  '4️⃣ *Mungkin Tidak* (4)'
];

export interface AkinatorStartResult {
  status: boolean;
  session?: string;
  signature?: string;
  question?: string;
  step?: number;
  progression?: number;
  akitude?: string;
  error?: string;
  debug?: any;
}

export interface AkinatorAnswerResult {
  status: boolean;
  won?: boolean;
  name?: string;
  description?: string;
  photo?: string;
  pseudo?: string;
  id_proposition?: string | number;
  question?: string;
  step?: number;
  progression?: number;
  akitude?: string;
  error?: string;
  debug?: any;
}

export function info() {
  return {
    status: true,
    name: 'Akinator Indonesia Scraper',
    version: '1.0.0',
    author: 'ScrapeBot / hazeloffc',
    website: 'https://id.akinator.com',
    endpoints: {
      info: 'info()',
      start: 'startAkinator(childMode)',
      answer: 'answerAkinator(session, signature, step, progression, ans, childMode)',
      back: 'backAkinator(session, signature, step, progression, childMode)',
      exclude: 'excludeAkinator(session, signature, step, progression, childMode)',
      win: 'winAkinator(session, signature, step, pid, name, desc, childMode)'
    },
    themes: THEMES,
    answers: ANSWERS_MAP,
    language: 'id'
  };
}

export async function startAkinator(childMode: boolean = false): Promise<AkinatorStartResult> {
  try {
    const gotScraping = await getGotScraping();
    const jar: Record<string, string> = {};

    const homeRes = await gotScraping({
      url: BASE_URL + '/',
      throwHttpErrors: false,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'id,en;q=0.9'
      }
    });

    const setCookies = homeRes.headers['set-cookie'];
    if (setCookies) {
      for (const c of setCookies) {
        const [kv] = c.split(';');
        const [k, v] = kv.split('=');
        if (k && v) jar[k.trim()] = v.trim();
      }
    }

    const cookieStr = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');

    const res = await gotScraping({
      url: BASE_URL + '/game',
      method: 'POST',
      form: { sid: THEMES.characters, cm: String(childMode) },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': cookieStr,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'referer': BASE_URL + '/'
      },
      throwHttpErrors: false
    });

    const $ = cheerio.load(res.body);
    const question = $('#question-label').text().trim();

    const sessionMatch = res.body.match(/name="session"[^>]*value="([^"]+)"/);
    const signatureMatch = res.body.match(/name="signature"[^>]*value="([^"]+)"/);
    const session = sessionMatch ? sessionMatch[1] : null;
    const signature = signatureMatch ? signatureMatch[1] : null;

    let akitude = 'defi.png';
    const akitudeMatch = res.body.match(/akitude[^"]*"[^"]*([^/]+\.png)"/);
    if (akitudeMatch) akitude = akitudeMatch[1];

    if (!session || !signature) {
      return {
        status: false,
        error: 'Gagal mengekstrak sesi Akinator dari server. Coba beberapa saat lagi.',
        debug: { bodySnippet: res.body.substring(0, 500) }
      };
    }

    return {
      status: true,
      session,
      signature,
      question: question || 'Apakah karakter Anda nyata?',
      step: 0,
      progression: 0,
      akitude
    };
  } catch (err: any) {
    return {
      status: false,
      error: err?.message || 'Gagal terhubung ke Akinator'
    };
  }
}

export async function answerAkinator(
  session: string,
  signature: string,
  step: number,
  progression: number,
  ans: string | number,
  childMode: boolean = false
): Promise<AkinatorAnswerResult> {
  try {
    const gotScraping = await getGotScraping();
    let answerId: number = -1;
    if (typeof ans === 'number') {
      answerId = ans;
    } else {
      const cleanAns = String(ans).toLowerCase().trim();
      answerId = ANSWERS_MAP[cleanAns] ?? -1;
    }

    if (answerId < 0 || answerId > 4) {
      return {
        status: false,
        error: `Pilihan jawaban tidak valid: "${ans}".\n\nKetik salah satu:\n0 = Ya\n1 = Tidak\n2 = Tidak Tahu\n3 = Mungkin\n4 = Mungkin Tidak`
      };
    }

    const res = await gotScraping({
      url: BASE_URL + '/answer',
      method: 'POST',
      form: {
        step: String(step),
        progression: String(progression),
        sid: String(THEMES.characters),
        cm: String(childMode),
        answer: String(answerId),
        session,
        signature
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'referer': BASE_URL + '/game'
      },
      throwHttpErrors: false
    });

    let data: any;
    try {
      data = JSON.parse(res.body);
    } catch {
      return { status: false, error: 'Gagal memproses jawaban dari Akinator', debug: { body: res.body.substring(0, 500) } };
    }

    if (data.completion === 'KO') {
      return { status: false, error: 'Sesi Akinator telah berakhir atau waktu habis.' };
    }

    if (data.id_proposition) {
      let photoUrl = data.photo || '';
      if (photoUrl) {
        if (photoUrl.startsWith('//')) {
          photoUrl = 'https:' + photoUrl;
        } else if (photoUrl.startsWith('/')) {
          photoUrl = BASE_URL + photoUrl;
        } else if (!photoUrl.startsWith('http://') && !photoUrl.startsWith('https://')) {
          photoUrl = `https://photos.akinator.com/${photoUrl}`;
        }
      }

      return {
        status: true,
        won: true,
        name: data.name_proposition,
        description: data.description_proposition,
        photo: photoUrl,
        pseudo: data.pseudo,
        id_proposition: data.id_proposition
      };
    }

    return {
      status: true,
      won: false,
      question: data.question,
      step: parseInt(data.step, 10),
      progression: parseFloat(data.progression),
      akitude: data.akitude
    };
  } catch (err: any) {
    return {
      status: false,
      error: err?.message || 'Gagal memproses jawaban Akinator'
    };
  }
}

export async function backAkinator(
  session: string,
  signature: string,
  step: number,
  progression: number,
  childMode: boolean = false
): Promise<AkinatorAnswerResult> {
  try {
    const gotScraping = await getGotScraping();
    const res = await gotScraping({
      url: BASE_URL + '/cancel_answer',
      method: 'POST',
      form: {
        step: String(step),
        progression: String(progression),
        sid: String(THEMES.characters),
        cm: String(childMode),
        session,
        signature
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'referer': BASE_URL + '/game'
      },
      throwHttpErrors: false
    });

    let data: any;
    try {
      data = JSON.parse(res.body);
    } catch {
      return { status: false, error: 'Gagal membatalkan jawaban sebelumnya' };
    }

    return {
      status: true,
      question: data.question,
      step: parseInt(data.step, 10),
      progression: parseFloat(data.progression),
      akitude: data.akitude
    };
  } catch (err: any) {
    return { status: false, error: err?.message || 'Gagal kembali ke pertanyaan sebelumnya' };
  }
}

export async function excludeAkinator(
  session: string,
  signature: string,
  step: number,
  progression: number,
  childMode: boolean = false
): Promise<AkinatorAnswerResult> {
  try {
    const gotScraping = await getGotScraping();
    const res = await gotScraping({
      url: BASE_URL + '/exclude',
      method: 'POST',
      form: {
        step: String(step),
        progression: String(progression),
        sid: String(THEMES.characters),
        cm: String(childMode),
        session,
        signature,
        step_last_proposition: String(step)
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'referer': BASE_URL + '/game'
      },
      throwHttpErrors: false,
      followRedirect: true
    });

    try {
      const data = JSON.parse(res.body);
      return {
        status: true,
        question: data.question,
        step: parseInt(data.step, 10),
        progression: parseFloat(data.progression),
        akitude: data.akitude
      };
    } catch {
      const $ = cheerio.load(res.body);
      const question = $('#question-label').text().trim();
      if (question) {
        return {
          status: true,
          question,
          step: 0,
          progression: 0,
          akitude: 'defi.png'
        };
      }
      return {
        status: false,
        error: 'Akinator menolak melanjutkan tebakan berikutnya.'
      };
    }
  } catch (err: any) {
    return { status: false, error: err?.message || 'Gagal meminta tebakan lain' };
  }
}

export async function winAkinator(
  session: string,
  signature: string,
  step: number,
  pid: string,
  name: string,
  desc: string,
  childMode: boolean = false
) {
  try {
    const gotScraping = await getGotScraping();
    const res = await gotScraping({
      url: BASE_URL + '/choice',
      method: 'POST',
      form: {
        sid: String(THEMES.characters),
        pid: String(pid),
        identifiant: '',
        pflag_photo: '0',
        charac_name: name,
        charac_desc: desc,
        session,
        signature,
        step: String(step)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      throwHttpErrors: false,
      followRedirect: false
    });
    return { status: true, message: 'Tebakan dikonfirmasi', statusCode: res.statusCode };
  } catch (err: any) {
    return { status: false, error: err?.message || 'Error konfirmasi tebakan' };
  }
}
