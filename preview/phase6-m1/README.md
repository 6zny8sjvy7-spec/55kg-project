# 第六階段 M1：隔離動作實驗室

這是原型預覽，不是正式跟練。三個動作：啞鈴彎舉、坐姿彈力繩划船、徒手臀橋。自行產生網格、骨架與動畫，不包含下載的人體模型或來源影片。肌群標示是概略解剖區域，非實測發力。

Three.js 0.170.0：MIT，完整授權見THREE-LICENSE.txt；瀏覽器WebGL 2渲染，無按次API、模型費或動畫費。esbuild僅開發時使用，不需使用者安裝。更新時固定版本重新build並重測。

## 隔離

index.html外層不讀寫任何儲存，只載入sandbox=allow-scripts內頁；沒有allow-same-origin。內頁為opaque origin，不能讀寫正式localStorage/sessionStorage/IndexedDB或存取父頁。connect-src none，沒有Service Worker、快取API、資料匯入或訓練儲存。僅保留當次記憶體，重開即回預設。

直接開trainer.html會拒絕初始化，須由index入口開啟。原型不含使用者歷史備份或個人預設身高／體重／年齡。三個程式／HTML請求約514KB未壓縮；實際gzip仍依伺服器回應，不以理論壓縮量冒充實測。

## 待驗收

人物外觀、3D動畫姿勢、肌群區域、相機視角、iPhone Safari GPU效能、真實背景／鎖屏、加入主畫面。參考文字已核對，未經教練／物理治療師專業核對，不作正式安全教學。M2智慧課表、M3跟練與紀錄、M4擴充動作、體重圖／歷史清單／MET改善尚未完成。

## 原創動作的文字參考

- https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/biceps-curl/vid-20084675
- https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/seated-row/vid-20084669
- https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/

僅參照指引，沒有複製第三方影片、圖片、人物或動畫。原型動作參數不是針對個人的醫療或負荷處方。
