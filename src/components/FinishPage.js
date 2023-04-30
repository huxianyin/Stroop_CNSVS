


function FinishPage(data) {
  const onClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
    }

    return (
      <div>
        <h1>終了🎉</h1>
        <p style={{"color":"black"}}>このページを閉じてください</p>
        </div>
      );
}


export default FinishPage;