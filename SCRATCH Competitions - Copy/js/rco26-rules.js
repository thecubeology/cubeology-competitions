/* Rules page:
   - Fetch comp details from CSV for RCO26 (name/mode/events/fees/registration end if present)
   - Render the user's full rules (cleanly formatted)
   - Add Timer + Typing rule (integrated system)
*/

function safe(v){ return (v ?? "").toString().trim(); }

function normalizeSingleDate(t){
  const s = safe(t).split(" ")[0];
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(m){
    const dd = m[1].padStart(2,"0");
    const mm = m[2].padStart(2,"0");
    const yy = m[3].slice(-2);
    return `${dd}/${mm}/${yy}`;
  }
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    const yy = m[1].slice(-2);
    const mm = m[2].padStart(2,"0");
    const dd = m[3].padStart(2,"0");
    return `${dd}/${mm}/${yy}`;
  }
  return safe(t);
}

function safeFeesLine(c){
  const base = safe(c.base_fee);
  const per = safe(c.per_event_fee);

  const fmt = (v) => {
    const x = safe(v);
    if(!x) return "";
    if(/[a-zA-Z]/.test(x)) return x;   // allow Free
    return `₹${x}`;
  };

  const a = base ? `${fmt(base)}` : "";
  const b = per ? `${fmt(per)}/event` : "";
  return [a,b].filter(Boolean).join(" • ");
}

function H(title, body){
  return `
    <div class="ruleBlock">
      <h3>${title}</h3>
      ${body}
    </div>
  `;
}

(async function(){
  const wrap = document.getElementById("wrap");

  try{
    const rows = await window.CB_API.getCSV(window.CB.CSV_COMPETITIONS);
    const c = (rows || []).find(x => safe(x.comp_id).toUpperCase() === "RCO26");

    if(!c){
      wrap.innerHTML = `<div class="rulesCard"><div class="sub">Rules could not be loaded.</div></div>`;
      return;
    }

    document.title = `Competition Rules • Cubeology`;

    const compName = safe(c.comp_name) || "Competition";
    const mode = safe(c.mode_label) || "—";
    const events = safe(c.events) || "—";
    const fees = safeFeesLine(c) || "—";
    const regEndRaw = safe(c.reg_end);
    const regEndShort = regEndRaw ? regEndRaw : "—";

    // If you want the rules text to always show the CSV reg_end, use regEndRaw.
    // Your provided sample mentions 1st Jan 2026 12:00 PM IST. We'll show CSV if available.
    const regCloseLine = regEndRaw
      ? `Registration closes on: <b>${regEndRaw}</b>`
      : `Registration closes on: <b>1st January 2026 at 12:00 PM IST</b>`;

    wrap.innerHTML = `
      <div class="rulesCard">
        <div class="rulesHead">
          <div>
            <div class="title">Rules</div>
            <div class="sub">Read completely before competing.</div>
          </div>
          <div class="pills">
            <span class="pill violet">RULES</span>
          </div>
        </div>

        ${H("1. General Information", `
          <div class="kvGrid">
            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Competition Name</div>
                <div class="kvValue">${compName}</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Mode</div>
                <div class="kvValue">${mode}</div>
              </div>
            </div>

            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Events</div>
                <div class="kvValue">${events}</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Entry Fee</div>
                <div class="kvValue">${fees}</div>
              </div>
            </div>

            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Registration</div>
                <div class="kvValue">Mandatory</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Scramble & Solve System</div>
                <div class="kvValue">Website-based with video verification</div>
              </div>
            </div>
          </div>
        `)}

        ${H("2. Registration Rules", `
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>Participants must register using the official registration link available on the competition page.</li>
            <li>${regCloseLine}</li>
            <li>This is a <b>single registration competition</b>:
              <ul>
                <li>All registered participants are <b>automatically registered for both events (3×3 & 2×2)</b>.</li>
                <li>There is <b>no participant limit</b> for any event.</li>
              </ul>
            </li>
            <li>Participants <b>must register using a valid email ID</b>, as competition credentials will be sent only to the registered email.</li>
            <li><b>Without registration and credentials, participation is not possible.</b></li>
          </ol>
        `)}

        ${H("3. Competition Schedule", `
          <div class="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>3×3 Cube</b></td>
                  <td>4:00 PM IST</td>
                  <td>4:30 PM IST</td>
                </tr>
                <tr>
                  <td><b>2×2 Cube</b></td>
                  <td>4:30 PM IST</td>
                  <td>5:00 PM IST</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul>
            <li>Participants may only solve <b>within the official event time window</b>.</li>
            <li>Solves attempted outside the event window <b>will not be considered</b>.</li>
          </ul>
        `)}

        ${H("4. Competition Credentials", `
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>Each participant will receive <b>one set of credentials</b> via email.</li>
            <li>The credentials are:
              <ul>
                <li><b>Mandatory</b></li>
                <li><b>Unique per participant</b></li>
                <li><b>Valid for the entire competition</b></li>
              </ul>
            </li>
            <li>The <b>same credentials</b> are used for both events.</li>
            <li>Credentials must <b>not be shared</b>. Any misuse will lead to disqualification.</li>
          </ol>
        `)}

        ${H("5. Competition Flow (How the Event Works)", `
          <div class="small"><b>Step-by-Step Process</b></div>
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>At the event start time (4:00 PM for 3×3 / 4:30 PM for 2×2):
              <ul>
                <li>Participant opens the competition page.</li>
                <li>Logs in using the provided credentials.</li>
              </ul>
            </li>
            <li>Once logged in:
              <ul>
                <li>Scrambles are revealed <b>one by one</b>.</li>
                <li>Each event consists of <b>5 solves</b>.</li>
              </ul>
            </li>
            <li>Participants must:
              <ul>
                <li>Perform <b>Solve 1 → Submit Time → Move to Solve 2</b></li>
                <li>Skipping solves or going back is <b>not allowed</b>.</li>
              </ul>
            </li>
          </ol>
        `)}

        ${H("6. Video Recording Rules (Mandatory)", `
          <div class="small"><b>Recording Requirements</b></div>
          <ul>
            <li>The entire attempt must be recorded in a single continuous video, starting from:
              <ul>
                <li>Opening the competition page</li>
                <li>Logging in with credentials</li>
                <li>Viewing scrambles</li>
                <li>Performing all 5 solves</li>
                <li>Typing all solve times</li>
              </ul>
            </li>
            <li><b>No cuts, edits, pauses, or transitions</b> are allowed.</li>
            <li>If the video contains any cut or edit, the participant <b>will be disqualified</b>.</li>
          </ul>

          <div class="small"><b>Camera & Visibility Rules</b></div>
          <ul>
            <li>The following must be clearly visible throughout:
              <ul>
                <li>Cube</li>
                <li>Scramble execution</li>
                <li>Timer device</li>
                <li>Final time display after every solve</li>
              </ul>
            </li>
          </ul>
        `)}

        ${H("7. Timer Rules", `
          <ul>
            <li>Participants may use any secondary timing device, including:
              <ul>
                <li>Stackmat timer</li>
                <li>Mobile timer</li>
                <li>Laptop / browser timer</li>
                <li>Split-screen timer on the same device</li>
              </ul>
            </li>
          </ul>

          <div class="small"><b>Important Notes</b></div>
          <ul>
            <li>If using a mobile phone for the competition page:
              <ul>
                <li>Switching apps or tabs may refresh the page. This is <b>not allowed</b>.</li>
              </ul>
            </li>
            <li>It is strongly recommended to use <b>two devices</b> (one for solving, one for timing).</li>
            <li>Timer display must be clearly visible to the camera at the end of every solve.</li>
          </ul>
        `)}

        ${H("7A. Website Timer / Typing Option (Integrated System)", `
          <ul>
            <li>The competition website provides two modes: <b>Timer</b> or <b>Typing</b>.</li>
            <li>You must choose the mode before starting solves (as shown on the competition page).</li>
            <li><b>Timer mode is one-time use per solve</b> (once recorded, it cannot be changed).</li>
            <li><b>Typing mode</b> requires entering the exact final time (or DNF) and then submitting.</li>
            <li>Do not refresh or reopen the solve flow after starting — it may invalidate the attempt.</li>
          </ul>
        `)}

        ${H("8. Inspection Rules", `
          <ul>
            <li>Standard <b>WCA inspection rules</b> apply.</li>
            <li>Maximum <b>15 seconds inspection</b> is allowed.</li>
            <li>Inspection must be clearly visible on video.</li>
          </ul>
        `)}

        ${H("9. Entering Solve Times", `
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>After each solve:
              <ul>
                <li>Show the timer clearly to the camera.</li>
                <li>Type the exact final time into the time input box.</li>
              </ul>
            </li>
            <li>Participants are responsible for calculating penalties themselves.</li>
          </ol>

          <div class="small"><b>Penalty Rules</b></div>
          <ul>
            <li><b>+2 Penalty</b> — add 2 seconds manually. Example: Timer shows <b>14.05</b> → enter <b>16.05</b></li>
            <li><b>DNF</b> — type <b>DNF</b> exactly as shown.</li>
            <li>Incorrect or false time entries may result in disqualification.</li>
          </ul>
        `)}

        ${H("10. Solve Submission Rules", `
          <ul>
            <li>Each solve must be submitted before moving to the next scramble.</li>
            <li>Participants cannot skip solves.</li>
            <li>Once a solve is submitted, it cannot be edited or re-submitted.</li>
          </ul>
        `)}

        ${H("11. Video Submission Process", `
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>After completing all 5 solves: stop the recording.</li>
            <li>Upload the video to:
              <ul>
                <li>Google Drive (public or view-only link) OR</li>
                <li>YouTube (Unlisted only)</li>
              </ul>
            </li>
            <li>Paste the video link into the Video Submission Button available on the competition page.</li>
          </ol>

          <div class="small"><b>Submission Deadline</b></div>
          <ul>
            <li><b>1st January 2026 – 11:59 PM IST</b></li>
            <li>Late submissions will not be accepted.</li>
          </ul>
        `)}

        ${H("12. Disqualification Rules", `
          <ul>
            <li>Video is not submitted</li>
            <li>Video contains cuts or edits</li>
            <li>Credentials are misused or shared</li>
            <li>Timer or solves are not clearly visible</li>
            <li>Solves are attempted outside the event window</li>
            <li>False or manipulated times are entered</li>
          </ul>
        `)}

        ${H("13. Video Verification & Results", `
          <ol style="margin:10px 0 0 18px; padding:0; font-weight:900;">
            <li>All videos will be manually verified after the competition.</li>
            <li>Verification period: 2–3 days</li>
            <li>Results will be published on the competition page OR via a dedicated results link.</li>
            <li>A “View Results” button will be available for participants.</li>
          </ol>
        `)}

        ${H("14. Prizes", `
          <ul>
            <li>Prizes (if applicable) will be awarded only after successful video verification.</li>
            <li>Any participant without a valid video will not be eligible for prizes.</li>
          </ul>
        `)}

        ${H("15. Final Authority", `
          <ul>
            <li>The organizers’ decision is final and binding.</li>
            <li>By registering, participants agree to all rules listed above.</li>
            <li>Any situation not explicitly covered will be resolved at the organizers’ discretion.</li>
          </ul>

          <div class="badgeRow">
            <span class="badge">Please read all rules completely before competing.</span>
          </div>
        `)}
      </div>
    `;

  }catch(err){
    console.error(err);
    wrap.innerHTML = `<div class="rulesCard"><div class="sub">Error loading rules.</div></div>`;
  }
})();
