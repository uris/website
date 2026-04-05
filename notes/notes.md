### Connecting to Vi
1. Click "Talk to Vi" - show connecting feedback on button
2. Trigger modal with Vi info and disclaimer. Choose continue (cancel quits).
3. Persist continue coice to local storage
4. Next time connecting, no modal needed
5. Await the microphone request
6. If error, quit (can start over)
7. If successful, update mic state to connected
8. Initiate the rtc connection, wait for the remote stream to intro
8. If successful Vi says hi
9. If error, keep mic connected but Vi never geoes to conected state

### Vi States needed
- Connecting (t/f) (used for the entore lifecycle)
- Connected (t/f)
- Mode (talk/type)

### Vi Actions needed
- Connect
- Disconnect
- Set Mode (talk/type)
- 
npm install @apple-pie/slice": "file:../uikit/pack/apple-pie-slice-0.1.28.tgz,