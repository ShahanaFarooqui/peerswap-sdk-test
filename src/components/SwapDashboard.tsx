import { Badge, Button, Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { SwapSwapStatus } from 'peerswap-sdk';
import { useNodeInfo, useInitiateSwapIn, useSwapsList, useInitiateSwapOut } from '../hooks/usePeerSwap';

function SwapStatusBadge({ status }: { status: SwapSwapStatus }) {
  const variants: Record<SwapSwapStatus, string> = {
    [SwapSwapStatus.Completed]: 'success',
    [SwapSwapStatus.Confirming]: 'warning',
    [SwapSwapStatus.Canceled]: 'danger',
    [SwapSwapStatus.AwaitOpeningTx]: 'primary',
    [SwapSwapStatus.Undefined]: 'secondary',
    [SwapSwapStatus.AwaitCsv]: 'info',
    [SwapSwapStatus.PayingInv]: 'dark',
    [SwapSwapStatus.CoopClosed]: 'secondary',
    [SwapSwapStatus.AwaitFee]: 'warning',
  };

  return <Badge bg={variants[status]}>{status}</Badge>;
}

export function SwapDashboard() {
  const { data: nodeInfo, isLoading, error } = useNodeInfo();
  const { data: swapsData, isLoading: swapsLoading } = useSwapsList({ body: { limit: 20, offset: 0 } });
  const { mutate: initiateSwap, isPending } = useInitiateSwapIn();
  const { mutate: initiateSwapOut, isPending: swapOutPending } = useInitiateSwapOut();

  if (isLoading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  );

  if (error) return (
    <Container className="mt-4">
      <p className="text-danger">Error connecting to node</p>
    </Container>
  );

  return (
    <Container className="mt-4">
      <h4 className="mb-4">Node ID: {nodeInfo?.nodeInfo?.nodeId}</h4>
      <hr />
      <h2 className="mb-3">Assets</h2>
      <Row className="mb-4 justify-content-center">
        {Object.entries(nodeInfo?.nodeInfo?.assets ?? {}).map(([key, asset]) => (
          <Col key={key} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{asset.asset}</Card.Title>
                <Card.Text>Min: {asset.minAmount}</Card.Text>
                <Card.Text>Max: {asset.maxAmount}</Card.Text>
                <Card.Text>Confirmations required: {asset.requiredConfirmations}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <hr />
      <Row className='mb-4 justify-content-center'>
        <Button
          variant="primary"
          onClick={() => initiateSwap({ body: { asset: 'BTC', claimInv: 'lnbc...' } })}
          disabled={isPending}
          className="col-2 me-4"
        >
          {isPending ? <><Spinner animation="border" size="sm" className="me-2" />Initiating...</> : 'Swap In'}
        </Button>
        <Button
          variant="dark"
          onClick={() => initiateSwapOut({ body: { asset: 'BTC', amount: '100000' } })}
          disabled={swapOutPending}
          className='col-2'
        >
          {swapOutPending ? <><Spinner animation="border" size="sm" className="me-2" />Initiating...</> : 'Swap Out'}
        </Button>
      </Row>
      <hr />
      <h2 className="mb-3">Swaps</h2>
      {swapsLoading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Swap ID</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {swapsData?.swaps?.map(swap => (
              <tr key={swap.swapId}>
                <td><code>{swap.swapId}</code></td>
                <td>{swap.type}</td>
                <td><SwapStatusBadge status={swap.status as SwapSwapStatus} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
